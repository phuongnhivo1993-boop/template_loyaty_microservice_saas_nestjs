import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendNotificationDto {
  @ApiProperty() @IsString() templateId: string;
  @ApiProperty() @IsString() recipient: string;
  @ApiProperty({ enum: ['email', 'sms', 'push'] }) @IsString() channel: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() variables?: Record<string, string>;
  @ApiPropertyOptional() @IsOptional() @IsString() tenantId?: string;
}

export class BroadcastDto {
  @ApiProperty() @IsString() templateId: string;
  @ApiProperty({ enum: ['email', 'sms', 'push'] }) @IsString() channel: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() variables?: Record<string, string>;
  @ApiProperty() @IsString() tenantId: string;
}

export class NotificationLogQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() tenantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channel?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() limit?: number;
}
