import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceStatus } from './dto/invoice.dto';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let invoiceService: any;

  beforeEach(async () => {
    invoiceService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByTenant: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        { provide: InvoiceService, useValue: invoiceService },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
  });

  describe('create', () => {
    it('should create and return an invoice', async () => {
      const dto = { subscriptionId: 'sub-1', amount: 100, dueDate: '2025-01-01' };
      const expected = { id: 'inv-1', ...dto };
      invoiceService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);
      expect(result).toEqual(expected);
      expect(invoiceService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated invoices', async () => {
      const query = { page: 1, limit: 20 };
      const expected = { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
      invoiceService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);
      expect(result).toEqual(expected);
      expect(invoiceService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single invoice', async () => {
      const expected = { id: 'inv-1', amount: 100 };
      invoiceService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('inv-1');
      expect(result).toEqual(expected);
      expect(invoiceService.findOne).toHaveBeenCalledWith('inv-1');
    });
  });

  describe('findByTenant', () => {
    it('should return invoices for a tenant', async () => {
      const expected = { data: [{ id: 'inv-1' }], total: 1, page: 1, limit: 20, totalPages: 1 };
      invoiceService.findByTenant.mockResolvedValue(expected);

      const result = await controller.findByTenant('tenant-1', 1, 20);
      expect(result).toEqual(expected);
      expect(invoiceService.findByTenant).toHaveBeenCalledWith('tenant-1', 1, 20);
    });
  });

  describe('update', () => {
    it('should update and return the invoice', async () => {
      const dto = { status: InvoiceStatus.PAID };
      const expected = { id: 'inv-1', status: 'PAID' };
      invoiceService.update.mockResolvedValue(expected);

      const result = await controller.update('inv-1', dto);
      expect(result).toEqual(expected);
      expect(invoiceService.update).toHaveBeenCalledWith('inv-1', dto);
    });
  });

  describe('remove', () => {
    it('should delete an invoice', async () => {
      const expected = { deleted: true };
      invoiceService.remove.mockResolvedValue(expected);

      const result = await controller.remove('inv-1');
      expect(result).toEqual(expected);
      expect(invoiceService.remove).toHaveBeenCalledWith('inv-1');
    });
  });
});
