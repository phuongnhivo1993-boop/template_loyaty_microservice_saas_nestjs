import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
  create(@Req() req: any, @Body() body: CreateOrderDto) {
    return this.orderService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List orders (with pagination & filter)' })
  findAll(@Req() req: any, @Query() query: OrderQueryDto) {
    return this.orderService.findAll({ ...query, tenantId: req.tenantId ?? query.tenantId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Put(':id/status')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, body.status, body.cancelReason);
  }

  @Get('member/:memberId')
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Get orders by member' })
  findByMember(@Param('memberId') memberId: string, @Query() query: OrderQueryDto) {
    return this.orderService.findAll({ ...query, memberId });
  }

  @Put(':id/cancel')
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Cancel an order with point reversal' })
  cancel(@Param('id') id: string, @Body('cancelReason') cancelReason?: string) {
    return this.orderService.updateStatus(id, 'CANCELLED', cancelReason);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get order status change timeline' })
  getTimeline(@Param('id') id: string) {
    return this.orderService.getTimeline(id);
  }
}
