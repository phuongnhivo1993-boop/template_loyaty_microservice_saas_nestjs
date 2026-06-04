import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WebSocketGatewayImpl } from './websocket.gateway';
import { WebSocketEventService } from './websocket-event.service';
import { WebSocketEventController } from './websocket-event.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT_SECRET environment variable is required');
        }
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
  ],
  controllers: [WebSocketEventController],
  providers: [WebSocketGatewayImpl, WebSocketEventService],
  exports: [WebSocketGatewayImpl, WebSocketEventService],
})
export class WebSocketModule {}
