import { Controller, Get, Post, Param, Query, UseGuards, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MemberSegmentationService } from './member-segmentation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { SegmentationQueryDto } from './dto/member-segmentation.dto';
import { ExportService } from '../common/services/export.service';
import type { Response } from 'express';

@ApiTags('Member Segmentation')
@Controller('member-segmentation')
export class MemberSegmentationController {
  constructor(
    private service: MemberSegmentationService,
    private exportService: ExportService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'List all members with RFM scores and segments' })
  findAll(@Req() req: any, @Query() query: SegmentationQueryDto) {
    return this.service.findAll({
      tenantId: req.tenantId ?? query.tenantId,
      page: query.page,
      limit: query.limit,
      segment: query.segment,
      sort: query.sort,
      search: query.search,
      period: query.period,
    });
  }

  @Get('summary')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Get segment summary with counts and aggregates' })
  getSummary(@Query('tenantId') tenantId?: string) {
    return this.service.getSegmentSummary({ tenantId });
  }

  @Post('recompute')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Manually trigger RFM recompute for tenant' })
  recompute(@Req() req: any) {
    return this.service.recomputeForTenant(req.tenantId);
  }

  @Get('export/csv')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Export RFM segmentation data as CSV' })
  async exportCsv(@Req() req: any, @Query() query: SegmentationQueryDto, @Res() res: Response) {
    const { data } = await this.service.findAll({ ...query, tenantId: req.tenantId ?? query.tenantId });
    const columns = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'segment', label: 'Segment' },
      { key: 'totalScore', label: 'RFM Score' },
      { key: 'recency', label: 'Recency Score' },
      { key: 'frequency', label: 'Frequency Score' },
      { key: 'monetary', label: 'Monetary Score' },
      { key: 'orderCount', label: 'Order Count' },
      { key: 'totalSpend', label: 'Total Spend' },
      { key: 'daysSinceLastOrder', label: 'Days Since Last Order' },
      { key: 'availablePoints', label: 'Available Points' },
    ];
    const flat = data.map((m: any) => ({
      fullName: m.fullName, email: m.email, phone: m.phone || '',
      segment: m.segment,
      totalScore: m.rfm.totalScore, recency: m.rfm.recency,
      frequency: m.rfm.frequency, monetary: m.rfm.monetary,
      orderCount: m.orderCount, totalSpend: m.totalSpend,
      daysSinceLastOrder: m.daysSinceLastOrder === 999 ? 'Never' : m.daysSinceLastOrder,
      availablePoints: m.availablePoints,
    }));
    const csv = this.exportService.toCsv(flat as any, columns);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="rfm_segmentation_${Date.now()}.csv"`);
    return res.send(csv);
  }

  @Get(':memberId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get RFM analysis for a specific member' })
  findOne(@Param('memberId') memberId: string) {
    return this.service.computeRFM(memberId);
  }
}
