import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { RolesGuard } from './auth/roles.guard';
import { TenantGuard } from './auth/tenant.guard';
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
import { BulkModule } from './bulk/bulk.module';
import { SettingsModule } from './settings/settings.module';
import { CheckinModule } from './checkin/checkin.module';
import { EarningRuleModule } from './earning-rule/earning-rule.module';
import { StoreModule } from './store/store.module';
import { CashbackModule } from './cashback/cashback.module';
import { PartnershipModule } from './partnership/partnership.module';
import { WebhookModule } from './webhook/webhook.module';
import { GiftCardModule } from './gift-card/gift-card.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { OrderModule } from './order/order.module';
import { MemberSegmentationModule } from './member-segmentation/member-segmentation.module';
import { CouponModule } from './coupon/coupon.module';
import { WebSocketModule } from './websocket/websocket.module';
import { CommonModule } from './common/common.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { Customer360Module } from './customer360/customer360.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: parseInt(process.env.RATE_LIMIT_MAX || '30', 10) }]),
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
    BulkModule,
    SettingsModule,
    CheckinModule,
    EarningRuleModule,
    StoreModule,
    CashbackModule,
    PartnershipModule,
    WebhookModule,
    GiftCardModule,
    FeedbackModule,
    ProductModule,
    ProductCategoryModule,
    OrderModule,
    MemberSegmentationModule,
    CouponModule,
    WebSocketModule,
    CommonModule,
    SubscriptionModule,
    Customer360Module,
    HealthModule,
  ],
  controllers: [ApiGatewayController],
  providers: [
    ApiGatewayService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
  ],
})
export class ApiGatewayModule {}
