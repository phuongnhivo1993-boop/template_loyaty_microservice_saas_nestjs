import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EarningRuleService } from './earning-rule.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateEarningRuleDto, UpdateEarningRuleDto, EarningRuleQueryDto } from './dto/earning-rule.dto';

@ApiTags('Point Earning Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('earning-rules')
export class EarningRuleController {
  constructor(private earningRuleService: EarningRuleService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a point earning rule' })
  create(@Body() body: CreateEarningRuleDto) {
    return this.earningRuleService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List earning rules (paginated)' })
  findAll(@Query() query: EarningRuleQueryDto) {
    return this.earningRuleService.findAll(query.tenantId, query.page, query.limit, query.search, query.category);
  }

  @Get('calculate')
  @ApiOperation({ summary: 'Calculate points for a purchase amount' })
  calculate(@Query('tenantId') tenantId: string, @Query('amount') amount: number, @Query('category') category?: string) {
    return this.earningRuleService.calculateEarning(tenantId, Number(amount), category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get earning rule by ID' })
  findOne(@Param('id') id: string) {
    return this.earningRuleService.findOne(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update earning rule' })
  update(@Param('id') id: string, @Body() body: UpdateEarningRuleDto) {
    return this.earningRuleService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete earning rule' })
  remove(@Param('id') id: string) {
    return this.earningRuleService.remove(id);
  }
}
