import { IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationPreferencesDto {
  @ApiProperty({ required: false }) @IsOptional() @IsObject() email?: { marketing: boolean; points: boolean; rewards: boolean; promotions: boolean };
  @ApiProperty({ required: false }) @IsOptional() @IsObject() sms?: { marketing: boolean; points: boolean; rewards: boolean };
  @ApiProperty({ required: false }) @IsOptional() @IsObject() push?: { marketing: boolean; points: boolean; rewards: boolean };
}
