import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
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
  @ApiBody({ type: RegisterMemberDto })
  @ApiOperation({ summary: 'Public member self-registration' })
  @ApiResponse({ status: 201, description: 'Member registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiBody({ type: CreateMemberDto })
  @ApiOperation({ summary: 'Admin: register a new member' })
  @ApiResponse({ status: 201, description: 'Member created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Req() req: any, @Body() body: CreateMemberDto) {
    return this.memberService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List members (with pagination & filtering)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'tierId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'tags', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of members' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Req() req: any, @Query() query: MemberQueryDto) {
    return this.memberService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.tierId, query.status, query.sort, query.tags);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String, description: 'Member ID' })
  @ApiOperation({ summary: 'Get member by ID' })
  @ApiResponse({ status: 200, description: 'Member found' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Member ID' })
  @ApiBody({ type: UpdateMemberDto })
  @ApiOperation({ summary: 'Update member' })
  @ApiResponse({ status: 200, description: 'Member updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  update(@Param('id') id: string, @Body() body: UpdateMemberDto) {
    return this.memberService.update(id, body);
  }

  @Post(':id/kyc')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Member ID' })
  @ApiOperation({ summary: 'Verify KYC for member' })
  @ApiResponse({ status: 201, description: 'KYC verified' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  kycVerify(@Param('id') id: string) {
    return this.memberService.kycVerify(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Member ID' })
  @ApiOperation({ summary: 'Delete member' })
  @ApiResponse({ status: 200, description: 'Member deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }

  @Post(':id/toggle-status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Member ID' })
  @ApiOperation({ summary: 'Lock/Unlock member' })
  @ApiResponse({ status: 201, description: 'Status toggled' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  toggleStatus(@Param('id') id: string) {
    return this.memberService.toggleStatus(id);
  }

  @Post(':id/tags')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Member ID' })
  @ApiBody({ schema: { type: 'object', properties: { tags: { type: 'array', items: { type: 'string' } } } } })
  @ApiOperation({ summary: 'Update member tags' })
  @ApiResponse({ status: 201, description: 'Tags updated' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  updateTags(@Param('id') id: string, @Body() body: { tags: string[] }) {
    return this.memberService.update(id, { tags: body.tags });
  }

  @Get(':id/tier-suggestion')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String, description: 'Member ID' })
  @ApiOperation({ summary: 'Get tier upgrade suggestion' })
  @ApiResponse({ status: 200, description: 'Tier suggestion' })
  tierSuggestion(@Param('id') id: string) {
    return this.memberService.getTierSuggestion(id);
  }

  @Get(':id/activity')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String, description: 'Member ID' })
  @ApiOperation({ summary: 'Get member activity timeline' })
  @ApiResponse({ status: 200, description: 'Activity timeline' })
  getActivity(@Param('id') id: string) {
    return this.memberService.getActivity(id);
  }

  @Post(':id/points')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Member ID' })
  @ApiBody({ schema: { type: 'object', properties: { amount: { type: 'number' }, reason: { type: 'string' } } } })
  @ApiOperation({ summary: 'Manual point adjustment (admin)' })
  @ApiResponse({ status: 201, description: 'Points adjusted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  adjustPoints(@Param('id') id: string, @Body() body: { amount: number; reason: string }) {
    return this.memberService.adjustPoints(id, body.amount, body.reason);
  }
}
