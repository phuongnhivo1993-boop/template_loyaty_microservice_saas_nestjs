import { Controller, Get, Param, Query, Res, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { ExportService } from '../common/services/export.service';
import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';

const entityConfig: Record<string, { model: string; columns: { key: string; label: string }[] }> = {
  tenants: {
    model: 'tenant',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'domain', label: 'Domain' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Created At' },
    ],
  },
  members: {
    model: 'member',
    columns: [
      { key: 'fullName', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status' },
      { key: 'availablePoints', label: 'Available Points' },
      { key: 'totalPoints', label: 'Total Points' },
      { key: 'createdAt', label: 'Created At' },
    ],
  },
  campaigns: {
    model: 'campaign',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'status', label: 'Status' },
      { key: 'startDate', label: 'Start Date' },
      { key: 'endDate', label: 'End Date' },
      { key: 'budget', label: 'Budget' },
    ],
  },
  rewards: {
    model: 'reward',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type' },
      { key: 'pointsRequired', label: 'Points Required' },
      { key: 'quantity', label: 'Quantity' },
    ],
  },
  vouchers: {
    model: 'voucher',
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'type', label: 'Type' },
      { key: 'value', label: 'Value' },
      { key: 'usedCount', label: 'Used Count' },
      { key: 'maxUsage', label: 'Max Usage' },
      { key: 'expiresAt', label: 'Expires At' },
    ],
  },
  point_transactions: {
    model: 'pointTransaction',
    columns: [
      { key: 'memberId', label: 'Member ID' },
      { key: 'type', label: 'Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'balance', label: 'Balance' },
      { key: 'reason', label: 'Reason' },
      { key: 'createdAt', label: 'Created At' },
    ],
  },
  referrals: {
    model: 'referral',
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'status', label: 'Status' },
      { key: 'rewardGiven', label: 'Reward Given' },
      { key: 'createdAt', label: 'Created At' },
    ],
  },
  coupons: {
    model: 'coupon',
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'type', label: 'Type' },
      { key: 'value', label: 'Value' },
      { key: 'usedCount', label: 'Used Count' },
      { key: 'maxUsage', label: 'Max Usage' },
      { key: 'status', label: 'Status' },
      { key: 'startDate', label: 'Start Date' },
      { key: 'endDate', label: 'End Date' },
      { key: 'createdAt', label: 'Created At' },
    ],
  },
  coupon_usages: {
    model: 'couponUsage',
    columns: [
      { key: 'couponId', label: 'Coupon ID' },
      { key: 'memberId', label: 'Member ID' },
      { key: 'orderId', label: 'Order ID' },
      { key: 'discountAmount', label: 'Discount Amount' },
      { key: 'createdAt', label: 'Used At' },
    ],
  },
};

@ApiTags('Export')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('export')
export class ExportController {
  constructor(
    private exportService: ExportService,
    private prisma: PrismaService,
  ) {}

  @Get(':entity')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Export data as CSV' })
  async exportCsv(
    @Res() res: Response,
    @Param('entity') entity: string,
    @Query('tenantId') tenantId?: string,
  ) {
    const config = entityConfig[entity];
    if (!config) {
      throw new NotFoundException(`Unknown entity: ${entity}`);
    }

    const prismaModel = (this.prisma as any)[config.model];
    const where = tenantId ? { tenantId } : {};
    const data = await prismaModel.findMany({ where, orderBy: { createdAt: 'desc' } });

    const csv = this.exportService.toCsv(data, config.columns);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${entity}_${Date.now()}.csv"`);
    return res.send(csv);
  }
}
