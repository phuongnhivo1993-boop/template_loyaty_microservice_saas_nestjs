import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty() @IsString() productId: string;
  @ApiProperty() @IsNumber() @Min(1) quantity: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) price?: number;
}

export class CreateOrderDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @IsString() tenantId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() storeId?: string;
  @ApiProperty({ type: [OrderItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto) items: OrderItemDto[];
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) shippingFee?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) tax?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) discount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() couponCode?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() paymentMethod?: string;
  @ApiProperty({ required: false }) @IsOptional() notes?: string;
  @ApiProperty({ required: false }) @IsOptional() shippingAddress?: any;
}

export class UpdateOrderStatusDto {
  @ApiProperty() @IsString() status: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() cancelReason?: string;
}

export class OrderQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() storeId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() paymentMethod?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() dateFrom?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() dateTo?: string;
}
