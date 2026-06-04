import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WebSocketGatewayImpl } from './websocket.gateway';
import { WebSocketEventService } from './websocket-event.service';
import { WebSocketEventController } from './websocket-event.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'loyalty-platform-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [WebSocketEventController],
  providers: [WebSocketGatewayImpl, WebSocketEventService],
  exports: [WebSocketGatewayImpl, WebSocketEventService],
})
export class WebSocketModule {}
