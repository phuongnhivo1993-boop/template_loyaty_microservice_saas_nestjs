import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateTenantDto, UpdateTenantDto, TenantQueryDto } from './dto/create-tenant.dto';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a new tenant' })
  create(@Body() body: CreateTenantDto) {
    return this.tenantService.create(body);
  }

  @Get()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List all tenants (with pagination & filtering)' })
  findAll(@Query() query: TenantQueryDto) {
    return this.tenantService.findAll(query.page, query.limit, query.search, query.status, query.sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tenant' })
  update(@Param('id') id: string, @Body() body: UpdateTenantDto) {
    return this.tenantService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tenant (soft)' })
  remove(@Param('id') id: string) {
    return this.tenantService.remove(id);
  }
}
