import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsJSON, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StoreStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
}

export class CreateStoreDto {
  @ApiProperty() @IsString() name: string;

  @ApiProperty() @IsString() code: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() email?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(-90) @Max(90) latitude?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(-180) @Max(180) longitude?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsJSON() openingHours?: string;

  @ApiProperty({ required: false, enum: StoreStatus }) @IsOptional() @IsEnum(StoreStatus) status?: StoreStatus;

  @ApiProperty() @IsString() tenantId: string;
}

export class UpdateStoreDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() code?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() email?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(-90) @Max(90) latitude?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(-180) @Max(180) longitude?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsJSON() openingHours?: string;

  @ApiProperty({ required: false, enum: StoreStatus }) @IsOptional() @IsEnum(StoreStatus) status?: StoreStatus;
}

export class AddStaffDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() storeId?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() userId?: string;

  @ApiProperty() @IsString() name: string;

  @ApiProperty() @IsString() phone: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() pinCode?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() active?: boolean;
}

export class UpdateStaffDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() pinCode?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() active?: boolean;
}
