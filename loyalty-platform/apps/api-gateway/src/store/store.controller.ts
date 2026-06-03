import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Stores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a store/outlet' })
  create(@Body() body: any) {
    return this.storeService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List stores' })
  findAll(@Query() query: any) {
    return this.storeService.findAll(query.tenantId, query.page, query.limit, query.search, query.status, query.sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update store' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.storeService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete store' })
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }

  @Post(':id/staff')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Add staff to store' })
  addStaff(@Param('id') id: string, @Body() body: any) {
    return this.storeService.addStaff(id, body);
  }

  @Get(':id/staff')
  @ApiOperation({ summary: 'List store staff' })
  listStaff(@Param('id') id: string) {
    return this.storeService.listStaff(id);
  }

  @Put('staff/:staffId')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update store staff' })
  updateStaff(@Param('staffId') staffId: string, @Body() body: any) {
    return this.storeService.updateStaff(staffId, body);
  }

  @Delete('staff/:staffId')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Remove store staff' })
  removeStaff(@Param('staffId') staffId: string) {
    return this.storeService.removeStaff(staffId);
  }
}
