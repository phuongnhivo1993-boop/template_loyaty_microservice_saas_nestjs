import { Test, TestingModule } from '@nestjs/testing';
import { ImportService } from './import.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

jest.mock('xlsx', () => ({
  read: jest.fn().mockReturnValue({
    SheetNames: ['Sheet1'],
    Sheets: { Sheet1: {} },
  }),
  utils: {
    sheet_to_json: jest.fn().mockReturnValue([{ name: 'Test' }]),
  },
}));

describe('ImportService', () => {
  let service: ImportService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      tenant: { create: jest.fn() },
      member: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ImportService>(ImportService);
  });

  describe('importCsv', () => {
    it('should import CSV data successfully for tenants', async () => {
      const csv = 'name,domain,email\nTestCo,testco.com,admin@testco.com\nOtherCo,other.com,info@other.com';
      prisma.tenant.create
        .mockResolvedValueOnce({ id: 't-1', name: 'TestCo' })
        .mockResolvedValueOnce({ id: 't-2', name: 'OtherCo' });

      const result = await service.importCsv('tenants', csv);
      expect(result.total).toBe(2);
      expect(result.created).toBe(2);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate required columns', async () => {
      const csv = 'name,domain\nTestCo,testco.com';
      await expect(service.importCsv('tenants', csv)).rejects.toThrow(BadRequestException);
    });

    it('should report per-row errors', async () => {
      const csv = 'name,domain,email\nTestCo,testco.com,admin@test.com\nBadRow,,';
      prisma.tenant.create.mockResolvedValueOnce({ id: 't-1', name: 'TestCo' });

      const result = await service.importCsv('tenants', csv);
      expect(result.total).toBe(2);
      expect(result.created).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Missing required fields');
    });
  });

  describe('importExcel', () => {
    it('should throw for unsupported entity', async () => {
      await expect(service.importExcel('unknown', 'base64content')).rejects.toThrow(BadRequestException);
    });
  });
});
