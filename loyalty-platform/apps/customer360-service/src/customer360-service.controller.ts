import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Customer360ServiceService } from './customer360-service.service';

@ApiTags('Customer360')
@ApiBearerAuth()
@Controller('customer360')
export class Customer360ServiceController {
  constructor(private readonly service: Customer360ServiceService) {}

  @Get(':memberId')
  @ApiOperation({ summary: 'Full unified member profile' })
  getUnifiedProfile(@Param('memberId') memberId: string) {
    return this.service.getUnifiedProfile(memberId);
  }

  @Get(':memberId/activity')
  @ApiOperation({ summary: 'Member activity timeline' })
  getActivityTimeline(@Param('memberId') memberId: string) {
    return this.service.getActivityTimeline(memberId);
  }

  @Get(':memberId/segments')
  @ApiOperation({ summary: 'Member segments/tags analysis' })
  getMemberSegments(@Param('memberId') memberId: string) {
    return this.service.getMemberSegments(memberId);
  }
}
