import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebSocketEventService } from './websocket-event.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('WebSocket Events')
@Controller('ws-events')
export class WebSocketEventController {
  constructor(private eventService: WebSocketEventService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Get recent WebSocket events' })
  getRecent(@Query('limit') limit?: number) {
    return this.eventService.getRecent(limit || 50);
  }

  @Get('replay')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Replay WebSocket events by room or member' })
  replay(
    @Query('room') room?: string,
    @Query('memberId') memberId?: string,
    @Query('since') since?: string,
    @Query('limit') limit?: number,
  ) {
    return this.eventService.replay(room, memberId, since, limit || 50);
  }
}
