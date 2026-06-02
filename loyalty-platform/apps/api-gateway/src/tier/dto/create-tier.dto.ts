import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTierDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false, default: 0 }) @IsOptional() @IsNumber() minPoints?: number;
  @ApiProperty({ required: false, default: 999999 }) @IsOptional() @IsNumber() maxPoints?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() benefits?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() color?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class UpdateTierDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() minPoints?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxPoints?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() benefits?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() color?: string;
}

export class TierQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
}
