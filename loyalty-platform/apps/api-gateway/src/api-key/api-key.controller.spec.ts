import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';

describe('ApiKeyController', () => {
  let controller: ApiKeyController;
  let apiKeyService: any;

  beforeEach(async () => {
    apiKeyService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      regenerate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiKeyController],
      providers: [
        { provide: ApiKeyService, useValue: apiKeyService },
      ],
    }).compile();

    controller = module.get<ApiKeyController>(ApiKeyController);
  });

  describe('create', () => {
    it('should create an API key and return it', async () => {
      const dto = { name: 'Test Key', permissions: ['read'] };
      const req = { tenantId: 'tenant-1' };
      const expected = { id: 'k1', name: 'Test Key', maskedKey: 'lp_te...xxxx' };
      apiKeyService.create.mockResolvedValue(expected);

      const result = await controller.create(req, dto);
      expect(result).toEqual(expected);
      expect(apiKeyService.create).toHaveBeenCalledWith('tenant-1', dto);
    });
  });

  describe('findAll', () => {
    it('should list all API keys for tenant', async () => {
      const req = { tenantId: 'tenant-1' };
      const expected = [{ id: 'k1', name: 'Key 1' }];
      apiKeyService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(req);
      expect(result).toEqual(expected);
      expect(apiKeyService.findAll).toHaveBeenCalledWith('tenant-1');
    });
  });

  describe('findOne', () => {
    it('should return a single API key', async () => {
      const req = { tenantId: 'tenant-1' };
      const expected = { id: 'k1', name: 'Key 1' };
      apiKeyService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(req, 'k1');
      expect(result).toEqual(expected);
      expect(apiKeyService.findOne).toHaveBeenCalledWith('tenant-1', 'k1');
    });
  });

  describe('remove', () => {
    it('should revoke an API key', async () => {
      const req = { tenantId: 'tenant-1' };
      const expected = { message: 'API key revoked' };
      apiKeyService.remove.mockResolvedValue(expected);

      const result = await controller.remove(req, 'k1');
      expect(result).toEqual(expected);
      expect(apiKeyService.remove).toHaveBeenCalledWith('tenant-1', 'k1');
    });
  });

  describe('regenerate', () => {
    it('should regenerate an API key', async () => {
      const req = { tenantId: 'tenant-1' };
      const expected = { id: 'k1', key: 'lp_tenant-1_newkey', maskedKey: 'lp_te...ewkey' };
      apiKeyService.regenerate.mockResolvedValue(expected);

      const result = await controller.regenerate(req, 'k1');
      expect(result).toEqual(expected);
      expect(apiKeyService.regenerate).toHaveBeenCalledWith('tenant-1', 'k1');
    });
  });
});
