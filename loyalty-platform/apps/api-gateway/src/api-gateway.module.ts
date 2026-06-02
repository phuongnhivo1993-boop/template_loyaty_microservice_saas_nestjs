import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { MemberSelfModule } from './member-self/member-self.module';
import { MemberVoucherModule } from './member-voucher/member-voucher.module';
import { TierModule } from './tier/tier.module';
import { PointModule } from './point/point.module';
import { CampaignModule } from './campaign/campaign.module';
import { RewardModule } from './reward/reward.module';
import { VoucherModule } from './voucher/voucher.module';
import { PromotionModule } from './promotion/promotion.module';
import { ReferralModule } from './referral/referral.module';
import { GamificationModule } from './gamification/gamification.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UploadModule } from './upload/upload.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationModule } from './notification/notification.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { ExportModule } from './export/export.module';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    MulterModule.register({ dest: './uploads' }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    TenantModule,
    UserModule,
    MemberModule,
    MemberSelfModule,
    MemberVoucherModule,
    TierModule,
    PointModule,
    CampaignModule,
    RewardModule,
    VoucherModule,
    PromotionModule,
    ReferralModule,
    GamificationModule,
    DashboardModule,
    UploadModule,
    AnalyticsModule,
    NotificationModule,
    AuditLogModule,
    ExportModule,
    ImportModule,
  ],
  controllers: [ApiGatewayController],
  providers: [
    ApiGatewayService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class ApiGatewayModule {}
