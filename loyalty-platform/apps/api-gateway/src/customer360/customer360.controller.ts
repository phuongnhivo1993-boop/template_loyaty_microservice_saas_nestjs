import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Customer360Service } from './customer360.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Customer 360')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer360')
export class Customer360Controller {
  constructor(private customer360Service: Customer360Service) {}

  @Get(':memberId')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get unified member profile (Customer 360)' })
  getUnifiedProfile(@Param('memberId') memberId: string) {
    return this.customer360Service.getUnifiedProfile(memberId);
  }

  @Get(':memberId/summary')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get member summary (spent, points, orders, vouchers)' })
  getSummary(@Param('memberId') memberId: string) {
    return this.customer360Service.getSummary(memberId);
  }

  @Get(':memberId/activity')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get member activity timeline' })
  getActivityTimeline(@Param('memberId') memberId: string) {
    return this.customer360Service.getActivityTimeline(memberId);
  }
}
