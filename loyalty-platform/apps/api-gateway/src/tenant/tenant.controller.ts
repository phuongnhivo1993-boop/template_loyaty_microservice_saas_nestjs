import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  create(@Body() body: { name: string; domain: string; email: string; phone?: string; address?: string; hostId: string }) {
    return this.tenantService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all tenants (with pagination & filtering)' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.tenantService.findAll(page, limit, search, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tenant' })
  update(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.tenantService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tenant (soft)' })
  remove(@Param('id') id: string) {
    return this.tenantService.remove(id);
  }
}
