import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateStoreDto, UpdateStoreDto, AddStaffDto, UpdateStaffDto } from './dto/store.dto';

@ApiTags('Stores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiBody({ type: CreateStoreDto })
  @ApiOperation({ summary: 'Create a store/outlet' })
  @ApiResponse({ status: 201, description: 'Store created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() body: CreateStoreDto) {
    return this.storeService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List stores' })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of stores' })
  findAll(@Query() query: any) {
    return this.storeService.findAll(query.tenantId, query.page, query.limit, query.search, query.status, query.sort);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Store ID' })
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiResponse({ status: 200, description: 'Store found' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Store ID' })
  @ApiBody({ type: UpdateStoreDto })
  @ApiOperation({ summary: 'Update store' })
  @ApiResponse({ status: 200, description: 'Store updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  update(@Param('id') id: string, @Body() body: UpdateStoreDto) {
    return this.storeService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Store ID' })
  @ApiOperation({ summary: 'Delete store' })
  @ApiResponse({ status: 200, description: 'Store deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }

  @Post(':id/staff')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Store ID' })
  @ApiBody({ type: AddStaffDto })
  @ApiOperation({ summary: 'Add staff to store' })
  @ApiResponse({ status: 201, description: 'Staff added' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  addStaff(@Param('id') id: string, @Body() body: AddStaffDto) {
    return this.storeService.addStaff(id, body);
  }

  @Get(':id/staff')
  @ApiParam({ name: 'id', type: String, description: 'Store ID' })
  @ApiOperation({ summary: 'List store staff' })
  @ApiResponse({ status: 200, description: 'List of staff' })
  listStaff(@Param('id') id: string) {
    return this.storeService.listStaff(id);
  }

  @Put('staff/:staffId')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'staffId', type: String, description: 'Staff ID' })
  @ApiBody({ type: UpdateStaffDto })
  @ApiOperation({ summary: 'Update store staff' })
  @ApiResponse({ status: 200, description: 'Staff updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Staff not found' })
  updateStaff(@Param('staffId') staffId: string, @Body() body: UpdateStaffDto) {
    return this.storeService.updateStaff(staffId, body);
  }

  @Delete('staff/:staffId')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'staffId', type: String, description: 'Staff ID' })
  @ApiOperation({ summary: 'Remove store staff' })
  @ApiResponse({ status: 200, description: 'Staff removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Staff not found' })
  removeStaff(@Param('staffId') staffId: string) {
    return this.storeService.removeStaff(staffId);
  }
}
