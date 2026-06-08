import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TierService } from './tier.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateTierDto, UpdateTierDto, TierQueryDto } from './dto/create-tier.dto';

@ApiTags('Tiers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tiers')
export class TierController {
  constructor(private tierService: TierService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a tier' })
  create(@Req() req: any, @Body() body: CreateTierDto) {
    return this.tierService.create({
      ...body,
      tenantId: req.tenantId,
      minPoints: body.minPoints ?? 0,
      maxPoints: body.maxPoints ?? 999999,
    });
  }

  @Get()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List tiers (with pagination & sort)' })
  findAll(@Req() req: any, @Query() query: TierQueryDto) {
    return this.tierService.findAll(req.tenantId, query.page, query.limit, query.search, query.sort);
  }

  @Get(':id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get tier by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.tierService.findOne(id, req.tenantId);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update tier' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: UpdateTierDto) {
    return this.tierService.update(id, body, req.tenantId);
  }

  @Get('stats')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Get tier statistics (member count, avg points)' })
  getStats(@Req() req: any) {
    return this.tierService.getStats(req.tenantId);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete tier' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.tierService.remove(id, req.tenantId);
  }
}
