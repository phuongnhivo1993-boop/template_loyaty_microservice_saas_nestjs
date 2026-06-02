import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TierService } from './tier.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Tiers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tiers')
export class TierController {
  constructor(private tierService: TierService) {}

  @Post()
  @ApiOperation({ summary: 'Create a tier' })
  create(@Body() body: { name: string; minPoints: number; maxPoints: number; benefits?: string; color?: string; tenantId: string }) {
    return this.tierService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List tiers (with pagination & sort)' })
  findAll(
    @Query('tenantId') tenantId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.tierService.findAll(tenantId, page, limit, search, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tier by ID' })
  findOne(@Param('id') id: string) {
    return this.tierService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tier' })
  update(@Param('id') id: string, @Body() body: { name?: string; minPoints?: number; maxPoints?: number; benefits?: string }) {
    return this.tierService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tier' })
  remove(@Param('id') id: string) {
    return this.tierService.remove(id);
  }
}
