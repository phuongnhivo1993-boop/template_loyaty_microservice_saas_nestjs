import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiProperty() @IsDateString() endDate: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() budget?: number;
  @ApiProperty() @IsString() tenantId: string;
}

export class UpdateCampaignDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() budget?: number;
}

export class CampaignQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
}
