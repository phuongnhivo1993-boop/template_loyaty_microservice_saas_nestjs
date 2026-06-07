import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

const RECENCY_SCORES = [
  { max: 7, score: 5 },
  { max: 30, score: 4 },
  { max: 60, score: 3 },
  { max: 90, score: 2 },
  { max: Infinity, score: 1 },
];

const FREQUENCY_SCORES = [
  { min: 10, score: 5 },
  { min: 5, score: 4 },
  { min: 3, score: 3 },
  { min: 2, score: 2 },
  { min: 0, score: 1 },
];

const MONETARY_SCORES = [
  { min: 10000000, score: 5 },
  { min: 5000000, score: 4 },
  { min: 1000000, score: 3 },
  { min: 500000, score: 2 },
  { min: 0, score: 1 },
];

const SEGMENTS: { label: string; minScore: number; description: string; color: string }[] = [
  { label: 'Champions', minScore: 13, description: 'Best customers — high recency, frequency, and spend', color: '#7c3aed' },
  { label: 'Loyal Customers', minScore: 10, description: 'Regular purchasers with consistent spend', color: '#2563eb' },
  { label: 'Potential Loyalists', minScore: 7, description: 'Recent buyers with moderate frequency', color: '#0891b2' },
  { label: 'New Customers', minScore: 5, description: 'Recent but low frequency', color: '#16a34a' },
  { label: 'At Risk', minScore: 3, description: 'Used to purchase but haven\'t recently', color: '#d97706' },
  { label: 'Lost', minScore: 0, description: 'No recent activity, low spend', color: '#dc2626' },
];

function scoreRecency(days: number): number {
  for (const s of RECENCY_SCORES) {
    if (days <= s.max) return s.score;
  }
  return 1;
}

function scoreFrequency(count: number): number {
  for (const s of FREQUENCY_SCORES) {
    if (count >= s.min) return s.score;
  }
  return 1;
}

function scoreMonetary(total: number): number {
  for (const s of MONETARY_SCORES) {
    if (total >= s.min) return s.score;
  }
  return 1;
}

function assignSegment(rfmScore: number): (typeof SEGMENTS)[0] {
  for (const s of SEGMENTS) {
    if (rfmScore >= s.minScore) return s;
  }
  return SEGMENTS[SEGMENTS.length - 1];
}

@Injectable()
export class MemberSegmentationService {
  private readonly logger = new Logger(MemberSegmentationService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduledRecompute() {
    this.logger.log('Starting scheduled RFM recompute...');
    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const tenant of tenants) {
      await this.computeAllForTenant(tenant.id);
    }
    this.logger.log(`Scheduled RFM recompute completed for ${tenants.length} tenants`);
  }

  async recomputeForTenant(tenantId: string) {
    return this.computeAllForTenant(tenantId);
  }

  private async computeAllForTenant(tenantId: string) {
    const members = await this.prisma.member.findMany({
      where: { tenantId },
      select: { id: true },
    });
    await Promise.all(members.map(m => this.computeRFM(m.id)));
    return { tenantId, recomputed: members.length };
  }

  async computeRFM(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { orders: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!member) return null;

    const now = new Date();
    const lastOrder = member.orders[0];
    const daysSinceLastOrder = lastOrder
      ? Math.floor((now.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    const aggregate = await this.prisma.order.aggregate({
      where: { memberId, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      _count: { id: true },
      _sum: { total: true },
    });

    const orderCount = aggregate._count.id;
    const totalSpend = aggregate._sum.total || 0;

    const r = scoreRecency(daysSinceLastOrder);
    const f = scoreFrequency(orderCount);
    const m = scoreMonetary(totalSpend);
    const rfmScore = r + f + m;
    const segment = assignSegment(rfmScore);
    const thresholds = await this.getThresholds(member.tenantId);

    return {
      memberId,
      fullName: member.fullName,
      email: member.email,
      rfm: { recency: r, frequency: f, monetary: m, totalScore: rfmScore },
      daysSinceLastOrder,
      orderCount,
      totalSpend,
      segment: segment.label,
      segmentDescription: segment.description,
      segmentColor: segment.color,
      thresholds,
    };
  }

  private async getThresholds(tenantId?: string) {
    if (!tenantId) return { recency: RECENCY_SCORES, frequency: FREQUENCY_SCORES, monetary: MONETARY_SCORES };
    const settingsRecords = await this.prisma.settings.findMany({
      where: {
        scope: 'tenant',
        scopeId: tenantId,
        key: { in: ['rfm_recency_scores', 'rfm_frequency_scores', 'rfm_monetary_scores'] },
      },
    });
    if (settingsRecords.length === 0) return { recency: RECENCY_SCORES, frequency: FREQUENCY_SCORES, monetary: MONETARY_SCORES };
    try {
      const recencySetting = settingsRecords.find((s: any) => s.key === 'rfm_recency_scores');
      const frequencySetting = settingsRecords.find((s: any) => s.key === 'rfm_frequency_scores');
      const monetarySetting = settingsRecords.find((s: any) => s.key === 'rfm_monetary_scores');
      const recency = recencySetting?.value ? JSON.parse(recencySetting.value as string) : RECENCY_SCORES;
      const frequency = frequencySetting?.value ? JSON.parse(frequencySetting.value as string) : FREQUENCY_SCORES;
      const monetary = monetarySetting?.value ? JSON.parse(monetarySetting.value as string) : MONETARY_SCORES;
      return { recency, frequency, monetary };
    } catch {
      return { recency: RECENCY_SCORES, frequency: FREQUENCY_SCORES, monetary: MONETARY_SCORES };
    }
  }

  async findAll(params: {
    tenantId?: string; page?: number; limit?: number; segment?: string;
    sort?: string; search?: string; period?: string;
  }) {
    const { tenantId, page = 1, limit = 20, segment, sort, search, period } = params;
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.member.count({ where });

    const members = await this.prisma.member.findMany({
      where,
      include: { tier: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (members.length === 0) {
      return { data: [], pagination: { page, limit, totalItems: 0, totalPages: 0 } };
    }

    const memberIds = members.map(m => m.id);
    const orderAggs = await this.prisma.order.groupBy({
      by: ['memberId'],
      where: { memberId: { in: memberIds }, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      _count: { id: true },
      _sum: { total: true },
      _max: { createdAt: true },
    });

    const orderMap = new Map(orderAggs.map(o => [o.memberId, o]));
    const now = new Date();

    let results = members.map(member => {
      const agg = orderMap.get(member.id);
      const lastOrderDate = agg?._max?.createdAt;
      const daysSinceLastOrder = lastOrderDate
        ? Math.floor((now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      const orderCount = agg?._count?.id || 0;
      const totalSpend = agg?._sum?.total || 0;

      const r = scoreRecency(daysSinceLastOrder);
      const f = scoreFrequency(orderCount);
      const m = scoreMonetary(totalSpend);
      const rfmScore = r + f + m;
      const segmentInfo = assignSegment(rfmScore);

      return {
        memberId: member.id,
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        avatar: member.avatar,
        tier: member.tier,
        status: member.status,
        totalPoints: member.totalPoints,
        availablePoints: member.availablePoints,
        createdAt: member.createdAt,
        rfm: { recency: r, frequency: f, monetary: m, totalScore: rfmScore },
        daysSinceLastOrder,
        orderCount,
        totalSpend,
        segment: segmentInfo.label,
        segmentDescription: segmentInfo.description,
        segmentColor: segmentInfo.color,
      };
    });

    if (segment) {
      results = results.filter(r => r.segment === segment);
    }

    const { orderBy, orderDirection } = parseSort(sort || 'rfmScore_desc');
    results.sort((a, b) => {
      let cmp = 0;
      if (orderBy === 'rfmScore') cmp = a.rfm.totalScore - b.rfm.totalScore;
      else if (orderBy === 'fullName') cmp = a.fullName.localeCompare(b.fullName);
      else if (orderBy === 'totalSpend') cmp = a.totalSpend - b.totalSpend;
      else if (orderBy === 'orderCount') cmp = a.orderCount - b.orderCount;
      else if (orderBy === 'daysSinceLastOrder') cmp = a.daysSinceLastOrder - b.daysSinceLastOrder;
      else cmp = a.rfm.totalScore - b.rfm.totalScore;
      return orderDirection === 'desc' ? -cmp : cmp;
    });

    return {
      data: results,
      pagination: { page, limit, totalItems: total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSegmentSummary(params: { tenantId?: string }) {
    const { tenantId } = params;
    const memberWhere: any = {};
    if (tenantId) memberWhere.tenantId = tenantId;

    const members = await this.prisma.member.findMany({
      where: memberWhere,
      select: { id: true, totalPoints: true, createdAt: true },
    });

    if (members.length === 0) {
      return { summary: SEGMENTS.map(s => ({ ...s, count: 0, totalSpend: 0, totalPoints: 0 })), totalMembers: 0 };
    }

    const memberIds = members.map(m => m.id);
    const orderAggs = await this.prisma.order.groupBy({
      by: ['memberId'],
      where: { memberId: { in: memberIds }, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      _count: { id: true },
      _sum: { total: true },
      _max: { createdAt: true },
    });

    const orderMap = new Map(orderAggs.map(o => [o.memberId, o]));
    const now = new Date();
    const segmentCounts: Record<string, { count: number; totalSpend: number; totalPoints: number }> = {};

    for (const member of members) {
      const agg = orderMap.get(member.id);
      const daysSinceLastOrder = agg?._max?.createdAt
        ? Math.floor((now.getTime() - agg._max.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      const orderCount = agg?._count?.id || 0;
      const totalSpend = agg?._sum?.total || 0;

      const rfmScore = scoreRecency(daysSinceLastOrder) + scoreFrequency(orderCount) + scoreMonetary(totalSpend);
      const segmentInfo = assignSegment(rfmScore);

      if (!segmentCounts[segmentInfo.label]) {
        segmentCounts[segmentInfo.label] = { count: 0, totalSpend: 0, totalPoints: 0 };
      }
      segmentCounts[segmentInfo.label].count++;
      segmentCounts[segmentInfo.label].totalSpend += totalSpend;
      segmentCounts[segmentInfo.label].totalPoints += member.totalPoints;
    }

    const summary = SEGMENTS.map(s => ({
      label: s.label, description: s.description, color: s.color,
      minScore: s.minScore, count: segmentCounts[s.label]?.count || 0,
      totalSpend: segmentCounts[s.label]?.totalSpend || 0,
      totalPoints: segmentCounts[s.label]?.totalPoints || 0,
    }));

    return { summary, totalMembers: members.length };
  }
}
