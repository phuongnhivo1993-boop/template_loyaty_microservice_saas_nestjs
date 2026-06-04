import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty() @IsString() code: string;
  @ApiProperty({ enum: ['PERCENTAGE', 'FIXED'] }) @IsString() type: string;
  @ApiProperty() @IsNumber() @Min(0) value: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) minAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) maxDiscount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) maxUsage?: number;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() @IsNumber() @Min(0) maxUsagePerMember?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class UpdateCouponDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() code?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) value?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) minAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) maxDiscount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) maxUsage?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) maxUsagePerMember?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class CouponQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
}

export class ValidateCouponDto {
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @IsNumber() @Min(0) orderTotal: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
}

export class ApplyCouponDto {
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @IsNumber() @Min(0) orderTotal: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
}

export class BulkGenerateCouponDto {
  @ApiProperty() @IsString() prefix: string;
  @ApiProperty() @IsNumber() @Min(1) count: number;
  @ApiProperty({ enum: ['PERCENTAGE', 'FIXED'] }) @IsString() type: string;
  @ApiProperty() @IsNumber() @Min(0) value: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) minAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) maxDiscount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) maxUsage?: number;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() @IsNumber() @Min(0) maxUsagePerMember?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() tenantId: string;
}
