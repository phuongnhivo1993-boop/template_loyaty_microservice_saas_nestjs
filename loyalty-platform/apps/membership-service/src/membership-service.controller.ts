import { Controller, Get, Post, Put, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MembershipServiceService } from './membership-service.service';
import { CreateMemberDto, UpdateMemberDto, MemberQueryDto } from './dto/member.dto';

@ApiTags('Members')
@Controller('members')
export class MembershipServiceController {
  constructor(private readonly membershipServiceService: MembershipServiceService) {}

  @Get()
  @ApiOperation({ summary: 'List members' })
  findAll(@Query() query: MemberQueryDto) {
    return this.membershipServiceService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member detail' })
  findOne(@Param('id') id: string) {
    return this.membershipServiceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create member' })
  create(@Body() dto: CreateMemberDto) {
    return this.membershipServiceService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update member' })
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.membershipServiceService.update(id, dto);
  }

  @Get(':id/tier')
  @ApiOperation({ summary: 'Get member tier info' })
  getTier(@Param('id') id: string) {
    return this.membershipServiceService.getTier(id);
  }
}

@ApiTags('Tiers')
@Controller('tiers')
export class TierController {
  constructor(private readonly membershipServiceService: MembershipServiceService) {}

  @Get()
  @ApiOperation({ summary: 'List tiers' })
  findAll(@Query('tenantId') tenantId: string) {
    return this.membershipServiceService.findAllTiers(tenantId);
  }
}
