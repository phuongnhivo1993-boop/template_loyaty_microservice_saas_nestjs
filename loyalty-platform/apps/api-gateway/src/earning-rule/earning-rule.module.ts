import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EarningRuleController } from './earning-rule.controller';
import { EarningRuleService } from './earning-rule.service';

@Module({
  imports: [PrismaModule],
  controllers: [EarningRuleController],
  providers: [EarningRuleService],
  exports: [EarningRuleService],
})
export class EarningRuleModule {}
