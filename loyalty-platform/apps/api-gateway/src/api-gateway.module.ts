import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
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

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    PrismaModule,
    AuthModule,
    TenantModule,
    UserModule,
    MemberModule,
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
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
