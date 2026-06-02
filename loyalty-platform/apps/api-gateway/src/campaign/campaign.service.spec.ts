import { Test, TestingModule } from '@nestjs/testing';
import { CampaignService } from './campaign.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CampaignService', () => {
  let service: CampaignService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      campaign: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
  });

  describe('create', () => {
    it('should create a campaign with valid dates', async () => {
      const data = { name: 'Summer Sale', startDate: '2025-06-01T00:00:00Z', endDate: '2025-07-01T00:00:00Z', tenantId: 'tenant-1' };
      const expected = { id: 'campaign-1', ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) };
      prisma.campaign.create.mockResolvedValue(expected);

      const result = await service.create(data);
      expect(result.id).toBe('campaign-1');
      expect(result.name).toBe('Summer Sale');
    });

    it('should throw BadRequestException when startDate >= endDate', async () => {
      const data = { name: 'Bad Campaign', startDate: '2025-07-01T00:00:00Z', endDate: '2025-06-01T00:00:00Z', tenantId: 'tenant-1' };
      expect(() => service.create(data)).toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated list', async () => {
      prisma.campaign.findMany.mockResolvedValue([{ id: 'campaign-1', name: 'Test Campaign' }]);
      prisma.campaign.count.mockResolvedValue(1);

      const result = await service.findAll('tenant-1', 1, 20);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a campaign by id', async () => {
      prisma.campaign.findUnique.mockResolvedValue({ id: 'campaign-1', name: 'Test Campaign' });
      const result = await service.findOne('campaign-1');
      expect(result.id).toBe('campaign-1');
    });

    it('should throw NotFoundException for non-existing campaign', async () => {
      prisma.campaign.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a campaign', async () => {
      prisma.campaign.findUnique.mockResolvedValue({ id: 'campaign-1' });
      prisma.campaign.update.mockResolvedValue({ id: 'campaign-1', name: 'Updated Campaign' });

      const result = await service.update('campaign-1', { name: 'Updated Campaign' });
      expect(result.name).toBe('Updated Campaign');
    });
  });

  describe('remove', () => {
    it('should delete a campaign', async () => {
      prisma.campaign.findUnique.mockResolvedValue({ id: 'campaign-1' });
      prisma.campaign.delete.mockResolvedValue({ id: 'campaign-1' });

      const result = await service.remove('campaign-1');
      expect(result.id).toBe('campaign-1');
    });
  });
});
