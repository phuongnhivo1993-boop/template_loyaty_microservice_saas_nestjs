import { Test, TestingModule } from '@nestjs/testing';
import { MemberVoucherService } from './member-voucher.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('MemberVoucherService', () => {
  let service: MemberVoucherService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      memberVoucher: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberVoucherService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<MemberVoucherService>(MemberVoucherService);
  });

  describe('assign', () => {
    it('should create a member-voucher assignment', async () => {
      prisma.memberVoucher.findFirst.mockResolvedValue(null);
      prisma.memberVoucher.create.mockResolvedValue({
        id: 'mv-1',
        memberId: 'member-1',
        voucherId: 'voucher-1',
        redeemed: false,
        voucher: { id: 'voucher-1', code: 'V20' },
        member: { id: 'member-1', fullName: 'John', email: 'john@test.com' },
      });

      const result = await service.assign('member-1', 'voucher-1');
      expect(result.id).toBe('mv-1');
      expect(result.redeemed).toBe(false);
    });

    it('should reject duplicate active assignment', async () => {
      prisma.memberVoucher.findFirst.mockResolvedValue({ id: 'existing', redeemed: false });
      await expect(service.assign('member-1', 'voucher-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated list, filters by memberId', async () => {
      prisma.memberVoucher.findMany.mockResolvedValue([{ id: 'mv-1', memberId: 'member-1' }]);
      prisma.memberVoucher.count.mockResolvedValue(1);

      const result = await service.findAll('member-1', 1, 20);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });

  describe('findOne', () => {
    it('should return assignment with includes', async () => {
      prisma.memberVoucher.findUnique.mockResolvedValue({
        id: 'mv-1',
        redeemed: false,
        voucher: { id: 'voucher-1', code: 'V20' },
        member: { id: 'member-1', fullName: 'John', email: 'john@test.com' },
      });

      const result = await service.findOne('mv-1');
      expect(result.id).toBe('mv-1');
      expect(result.voucher.code).toBe('V20');
    });

    it('should throw NotFoundException', async () => {
      prisma.memberVoucher.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('redeem', () => {
    it('should mark as redeemed', async () => {
      prisma.memberVoucher.findUnique.mockResolvedValue({
        id: 'mv-1',
        redeemed: false,
        voucher: { id: 'voucher-1', code: 'V20' },
      });
      prisma.memberVoucher.update.mockResolvedValue({
        id: 'mv-1',
        redeemed: true,
        redeemedAt: new Date(),
      });

      const result = await service.redeem('mv-1');
      expect(result.redeemed).toBe(true);
    });
  });

  describe('remove', () => {
    it('should delete assignment', async () => {
      prisma.memberVoucher.findUnique.mockResolvedValue({ id: 'mv-1' });
      prisma.memberVoucher.delete.mockResolvedValue({ id: 'mv-1' });

      const result = await service.remove('mv-1');
      expect(result.id).toBe('mv-1');
    });
  });
});
