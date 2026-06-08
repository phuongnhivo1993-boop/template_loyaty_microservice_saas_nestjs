import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto } from './dto/order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Create order with point earning' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Req() req: any, @Body() body: CreateOrderDto) {
    return this.orderService.create({ ...body, tenantId: req.tenantId });
  }

  @Get()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List orders (with pagination & filter)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'storeId', required: false, type: String })
  @ApiQuery({ name: 'paymentMethod', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Req() req: any, @Query() query: OrderQueryDto) {
    return this.orderService.findAll({ ...query, tenantId: req.tenantId });
  }

  @Get(':id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.orderService.findOne(id, req.tenantId);
  }

  @Put(':id/status')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateStatus(@Req() req: any, @Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, body.status, body.cancelReason, req.tenantId);
  }

  @Get('member/:memberId')
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Get orders by member' })
  @ApiParam({ name: 'memberId', type: String, description: 'Member ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of member orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByMember(@Param('memberId') memberId: string, @Query() query: OrderQueryDto) {
    return this.orderService.findAll({ ...query, memberId });
  }

  @Put(':id/cancel')
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Cancel an order with point reversal' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiBody({ schema: { type: 'object', properties: { cancelReason: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Order cancelled' })
  @ApiResponse({ status: 400, description: 'Cannot cancel order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  cancel(@Req() req: any, @Param('id') id: string, @Body('cancelReason') cancelReason?: string) {
    return this.orderService.updateStatus(id, 'CANCELLED', cancelReason, req.tenantId);
  }

  @Get(':id/timeline')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get order status change timeline' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order timeline' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getTimeline(@Req() req: any, @Param('id') id: string) {
    return this.orderService.getTimeline(id, req.tenantId);
  }
}
