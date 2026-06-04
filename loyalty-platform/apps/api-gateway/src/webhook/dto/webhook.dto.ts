import { IsString, IsOptional, IsBoolean, IsArray, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWebhookEndpointDto {
  @ApiProperty() @IsString() @Type(() => String) name: string;

  @ApiProperty() @IsUrl() @Type(() => String) url: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() @Type(() => String) secret?: string;

  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) events: string[];

  @ApiProperty({ required: false, default: true }) @IsOptional() @IsBoolean() @Type(() => Boolean) active?: boolean;
}

export class UpdateWebhookEndpointDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() @Type(() => String) name?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsUrl() @Type(() => String) url?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() @Type(() => String) secret?: string;

  @ApiProperty({ required: false, type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) events?: string[];

  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() @Type(() => Boolean) active?: boolean;
}
