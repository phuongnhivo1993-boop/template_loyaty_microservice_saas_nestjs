import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from './api-key.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ApiKeyService', () => {
  let service: ApiKeyService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      settings: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
  });

  describe('create', () => {
    it('should create an API key', async () => {
      prisma.settings.findUnique.mockResolvedValue(null);
      prisma.settings.upsert.mockResolvedValue({});

      const result = await service.create('tenant-1', { name: 'Test Key' });
      expect(result.name).toBe('Test Key');
      expect(result.key).toMatch(/^lp_tenant-1_/);
      expect(result.maskedKey).toBeDefined();
    });

    it('should append to existing keys', async () => {
      prisma.settings.findUnique.mockResolvedValue({
        value: [{ id: 'existing-id', name: 'Old Key', key: 'old-key-xxx' }],
      });
      prisma.settings.upsert.mockResolvedValue({});

      const result = await service.create('tenant-1', { name: 'New Key' });
      expect(result.name).toBe('New Key');
    });
  });

  describe('findAll', () => {
    it('should return all keys without the raw key', async () => {
      prisma.settings.findUnique.mockResolvedValue({
        value: [
          { id: 'k1', name: 'Key 1', key: 'raw-1', maskedKey: 'raw...-1' },
          { id: 'k2', name: 'Key 2', key: 'raw-2', maskedKey: 'raw...-2' },
        ],
      });

      const result = await service.findAll('tenant-1');
      expect(result).toHaveLength(2);
      expect(result[0].key).toBeUndefined();
    });

    it('should return empty array when no keys exist', async () => {
      prisma.settings.findUnique.mockResolvedValue(null);
      const result = await service.findAll('tenant-1');
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a key by id without raw key', async () => {
      prisma.settings.findUnique.mockResolvedValue({
        value: [
          { id: 'k1', name: 'Key 1', key: 'raw-1', maskedKey: 'raw...-1' },
        ],
      });

      const result = await service.findOne('tenant-1', 'k1');
      expect(result.name).toBe('Key 1');
      expect(result.key).toBeUndefined();
    });

    it('should throw NotFoundException for missing key', async () => {
      prisma.settings.findUnique.mockResolvedValue({
        value: [{ id: 'k1', name: 'Key 1' }],
      });

      await expect(service.findOne('tenant-1', 'invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a key', async () => {
      prisma.settings.findUnique.mockResolvedValue({
        value: [
          { id: 'k1', name: 'Key 1' },
          { id: 'k2', name: 'Key 2' },
        ],
      });
      prisma.settings.upsert.mockResolvedValue({});

      const result = await service.remove('tenant-1', 'k1');
      expect(result.message).toBe('API key revoked');
    });

    it('should throw NotFoundException for missing key', async () => {
      prisma.settings.findUnique.mockResolvedValue({
        value: [{ id: 'k1', name: 'Key 1' }],
      });

      await expect(service.remove('tenant-1', 'invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateApiKey', () => {
    it('should return true for a valid key', async () => {
      prisma.settings.findUnique.mockResolvedValue({
        value: [
          { id: 'k1', name: 'Key 1', key: 'lp_tenant-1_abc123', active: true },
        ],
      });

      const result = await service.validateApiKey('lp_tenant-1_abc123');
      expect(result).toBe(true);
    });

    it('should return false for an invalid format', async () => {
      const result = await service.validateApiKey('invalid-key');
      expect(result).toBe(false);
    });

    it('should return false for an inactive key', async () => {
      prisma.settings.findUnique.mockResolvedValue({
        value: [
          { id: 'k1', key: 'lp_tenant-1_abc123', active: false },
        ],
      });

      const result = await service.validateApiKey('lp_tenant-1_abc123');
      expect(result).toBe(false);
    });

    it('should return false when no keys exist', async () => {
      prisma.settings.findUnique.mockResolvedValue(null);
      const result = await service.validateApiKey('lp_tenant-1_abc123');
      expect(result).toBe(false);
    });
  });
});
