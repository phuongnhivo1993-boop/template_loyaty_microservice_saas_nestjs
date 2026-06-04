import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CouponModule } from '../coupon/coupon.module';
import { PointModule } from '../point/point.module';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [CouponModule, PointModule, WebSocketModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
