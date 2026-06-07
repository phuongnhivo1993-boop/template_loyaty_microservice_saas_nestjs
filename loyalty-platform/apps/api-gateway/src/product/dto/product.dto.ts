import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, Min, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BulkProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export class CreateProductDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() slug?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) compareAtPrice?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) costPrice?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imageUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() unit?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) stock?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sku?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() barcode?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() categoryId?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class UpdateProductDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() slug?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) price?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) compareAtPrice?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) costPrice?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imageUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() unit?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) stock?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sku?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() barcode?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() categoryId?: string;
}

export class ProductQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() categoryId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) priceMin?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) priceMax?: number;
  @ApiProperty({ required: false, enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] }) @IsOptional() @IsString() stockStatus?: string;
}

export class BulkStatusDto {
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) ids: string[];
  @ApiProperty({ enum: BulkProductStatus }) @IsEnum(BulkProductStatus) status: BulkProductStatus;
}

export class BulkIdsDto {
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) ids: string[];
}
