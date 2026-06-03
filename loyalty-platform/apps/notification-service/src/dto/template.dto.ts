import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationTemplateDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ enum: ['email', 'sms', 'push'] }) @IsString() type: string;
  @ApiProperty() @IsString() subject: string;
  @ApiProperty() @IsString() content: string;
  @ApiPropertyOptional() @IsOptional() @IsString() variables?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class UpdateNotificationTemplateDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional({ enum: ['email', 'sms', 'push'] }) @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subject?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() variables?: string;
}
