import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SegmentationQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() @IsNumber() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() @IsNumber() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() segment?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() period?: string;
}
