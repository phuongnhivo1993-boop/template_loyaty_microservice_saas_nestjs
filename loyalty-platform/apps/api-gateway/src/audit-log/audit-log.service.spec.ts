import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogService } from './audit-log.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuditLogService', () => {
  let service: AuditLogService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      auditLog: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
  });

  describe('log', () => {
    it('should create an audit log entry', async () => {
      const logData = { entityType: 'User', entityId: 'user-1', action: 'CREATE', userId: 'admin-1' };
      prisma.auditLog.create.mockResolvedValue({ id: 'log-1', ...logData });

      const result = await service.log(logData);
      expect(result.id).toBe('log-1');
      expect(result.action).toBe('CREATE');
      expect(result.entityType).toBe('User');
    });
  });

  describe('findAll', () => {
    it('should return paginated list', async () => {
      prisma.auditLog.findMany.mockResolvedValue([{ id: 'log-1', action: 'CREATE' }]);
      prisma.auditLog.count.mockResolvedValue(1);

      const result = await service.findAll(1, 20);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should filter by entityType', async () => {
      prisma.auditLog.findMany.mockResolvedValue([{ id: 'log-1', entityType: 'User' }]);
      prisma.auditLog.count.mockResolvedValue(1);

      const result = await service.findAll(1, 20, undefined, 'User');
      expect(result.total).toBe(1);
      expect(result.data[0].entityType).toBe('User');
    });

    it('should filter by action', async () => {
      prisma.auditLog.findMany.mockResolvedValue([{ id: 'log-1', action: 'CREATE' }]);
      prisma.auditLog.count.mockResolvedValue(1);

      const result = await service.findAll(1, 20, undefined, undefined, 'CREATE');
      expect(result.total).toBe(1);
      expect(result.data[0].action).toBe('CREATE');
    });

    it('should filter by userId', async () => {
      prisma.auditLog.findMany.mockResolvedValue([{ id: 'log-1', userId: 'admin-1' }]);
      prisma.auditLog.count.mockResolvedValue(1);

      const result = await service.findAll(1, 20, undefined, undefined, undefined, 'admin-1');
      expect(result.total).toBe(1);
      expect(result.data[0].userId).toBe('admin-1');
    });
  });
});
