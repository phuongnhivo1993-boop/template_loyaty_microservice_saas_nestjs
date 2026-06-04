import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MemberService } from './member.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { SkipTenantCheck } from '../auth/skip-tenant.decorator';
import { CreateMemberDto, UpdateMemberDto, MemberQueryDto, RegisterMemberDto } from './dto/create-member.dto';

@ApiTags('Members')
@Controller('members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post('register')
  @SkipTenantCheck()
  @ApiOperation({ summary: 'Public member self-registration' })
  async register(@Body() body: RegisterMemberDto) {
    let { tenantId } = body;
    if (!tenantId && body.tenantDomain) {
      const tenant = await this.memberService.findTenantByDomain(body.tenantDomain);
      if (tenant) tenantId = tenant.id;
    }
    return this.memberService.create({ ...body, tenantId: tenantId || '' });
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Admin: register a new member' })
  create(@Req() req: any, @Body() body: CreateMemberDto) {
    return this.memberService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List members (with pagination & filtering)' })
  findAll(@Req() req: any, @Query() query: MemberQueryDto) {
    return this.memberService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.tierId, query.status, query.sort, query.tags);
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
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Update member' })
  update(@Param('id') id: string, @Body() body: UpdateMemberDto) {
    return this.memberService.update(id, body);
  }

  @Post(':id/kyc')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Verify KYC for member' })
  kycVerify(@Param('id') id: string) {
    return this.memberService.kycVerify(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete member' })
  remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }

  @Post(':id/toggle-status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Lock/Unlock member' })
  toggleStatus(@Param('id') id: string) {
    return this.memberService.toggleStatus(id);
  }

  @Post(':id/tags')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Update member tags' })
  updateTags(@Param('id') id: string, @Body() body: { tags: string[] }) {
    return this.memberService.update(id, { tags: body.tags });
  }

  @Get(':id/tier-suggestion')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get tier upgrade suggestion' })
  tierSuggestion(@Param('id') id: string) {
    return this.memberService.getTierSuggestion(id);
  }

  @Get(':id/activity')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get member activity timeline' })
  getActivity(@Param('id') id: string) {
    return this.memberService.getActivity(id);
  }

  @Post(':id/points')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Manual point adjustment (admin)' })
  adjustPoints(@Param('id') id: string, @Body() body: { amount: number; reason: string }) {
    return this.memberService.adjustPoints(id, body.amount, body.reason);
  }
}
