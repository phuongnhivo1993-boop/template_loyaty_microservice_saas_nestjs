import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      notificationTemplate: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      notificationLog: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  describe('createTemplate', () => {
    it('should create a notification template', async () => {
      const templateData = {
        name: 'Welcome Email',
        type: 'email',
        subject: 'Welcome {{name}}',
        content: 'Hello {{name}}, welcome!',
        tenantId: 'tenant-1',
      };
      prisma.notificationTemplate.create.mockResolvedValue({ id: 'template-1', ...templateData });

      const result = await service.createTemplate(templateData);
      expect(result.id).toBe('template-1');
      expect(result.name).toBe('Welcome Email');
    });
  });

  describe('listTemplates', () => {
    it('should return paginated templates', async () => {
      prisma.notificationTemplate.findMany.mockResolvedValue([{ id: 'template-1', name: 'Test' }]);
      prisma.notificationTemplate.count.mockResolvedValue(1);

      const result = await service.listTemplates('tenant-1', 1, 20);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });

    it('should search templates by name', async () => {
      prisma.notificationTemplate.findMany.mockResolvedValue([]);
      prisma.notificationTemplate.count.mockResolvedValue(0);

      const result = await service.listTemplates('tenant-1', 1, 20, 'welcome');
      expect(result.total).toBe(0);
    });
  });

  describe('updateTemplate', () => {
    it('should update existing template', async () => {
      prisma.notificationTemplate.findUnique.mockResolvedValue({ id: 'template-1' });
      prisma.notificationTemplate.update.mockResolvedValue({ id: 'template-1', subject: 'Updated Subject' });

      const result = await service.updateTemplate('template-1', { subject: 'Updated Subject' });
      expect(result.subject).toBe('Updated Subject');
    });

    it('should throw NotFoundException for non-existing template', async () => {
      prisma.notificationTemplate.findUnique.mockResolvedValue(null);
      await expect(service.updateTemplate('invalid', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTemplate', () => {
    it('should delete existing template', async () => {
      prisma.notificationTemplate.findUnique.mockResolvedValue({ id: 'template-1' });
      prisma.notificationTemplate.delete.mockResolvedValue({ id: 'template-1' });

      const result = await service.deleteTemplate('template-1');
      expect(result.deleted).toBe(true);
    });

    it('should throw on non-existing template', async () => {
      prisma.notificationTemplate.findUnique.mockResolvedValue(null);
      await expect(service.deleteTemplate('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('send', () => {
    it('should send notification using template', async () => {
      prisma.notificationTemplate.findUnique.mockResolvedValue({
        id: 'template-1',
        subject: 'Welcome {{name}}',
        content: 'Hello {{name}}!',
        tenantId: 'tenant-1',
      });
      prisma.notificationLog.create.mockResolvedValue({
        id: 'log-1',
        templateId: 'template-1',
        recipient: 'user@test.com',
        channel: 'email',
        subject: 'Welcome John',
        content: 'Hello John!',
        status: 'SENT',
        sentAt: new Date(),
        tenantId: 'tenant-1',
      });

      const result = await service.send({
        templateId: 'template-1',
        recipient: 'user@test.com',
        channel: 'email',
        variables: { name: 'John' },
      });
      expect(result.status).toBe('SENT');
      expect(result.channel).toBe('email');
    });

    it('should throw for non-existing template', async () => {
      prisma.notificationTemplate.findUnique.mockResolvedValue(null);
      await expect(service.send({ templateId: 'invalid', recipient: 'test@test.com', channel: 'email' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('listLogs', () => {
    it('should return paginated logs', async () => {
      prisma.notificationLog.findMany.mockResolvedValue([{ id: 'log-1' }]);
      prisma.notificationLog.count.mockResolvedValue(1);

      const result = await service.listLogs('tenant-1', 1, 20);
      expect(result.total).toBe(1);
    });
  });
});
