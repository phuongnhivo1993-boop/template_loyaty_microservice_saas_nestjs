import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MemberService } from './member.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Members')
@Controller('members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post('register')
  @ApiOperation({ summary: 'Public member self-registration' })
  register(@Body() body: { email: string; fullName: string; phone?: string; tenantId: string }) {
    return this.memberService.create(body);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Admin: register a new member' })
  create(@Body() body: { email: string; fullName: string; phone?: string; tenantId: string; tierId?: string }) {
    return this.memberService.create(body);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List members (with pagination & filtering)' })
  findAll(
    @Query('tenantId') tenantId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('tierId') tierId?: string,
    @Query('status') status?: string,
  ) {
    return this.memberService.findAll(tenantId, page, limit, search, tierId, status);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get member by ID' })
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update member' })
  update(@Param('id') id: string, @Body() body: { fullName?: string; phone?: string; tierId?: string; status?: string }) {
    return this.memberService.update(id, body);
  }

  @Post(':id/kyc')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify KYC for member' })
  kycVerify(@Param('id') id: string) {
    return this.memberService.kycVerify(id);
  }

  @Post(':id/toggle-status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lock/Unlock member' })
  toggleStatus(@Param('id') id: string) {
    return this.memberService.toggleStatus(id);
  }
}
