import { Type } from 'class-transformer';
import { IsEmail, IsString, MinLength, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterHostDto {
  @ApiProperty({ example: 'host@loyalty.vn' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Host@123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Platform Host' })
  @IsString()
  name: string;
}

export class CreateTenantDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() domain: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty() @IsString() hostId: string;
}

export class CreateMemberDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() fullName: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty() @IsString() tenantId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tierId?: string;
}

export class CreateCampaignDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() startDate: string;
  @ApiProperty() @IsString() endDate: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() budget?: number;
  @ApiProperty() @IsString() tenantId: string;
}

export class CreateRewardDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @Type(() => Number) @IsNumber() pointsRequired: number;
  @ApiProperty() @Type(() => Number) @IsNumber() quantity: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imageUrl?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class RedeemRewardDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() quantity?: number;
}

export class CreateVoucherDto {
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @Type(() => Number) @IsNumber() value: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() maxUsage?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() expiresAt?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class ValidateVoucherDto {
  @ApiProperty() @IsString() code: string;
}

export class PaginationDto {
  @ApiProperty({ required: false, default: 1 }) @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
}

export class EarnPointsDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @Type(() => Number) @IsNumber() amount: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() reason?: string;
}

export class AdjustPointsDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @Type(() => Number) @IsNumber() amount: number;
  @ApiProperty() @IsString() reason: string;
}

export class CreateNotificationTemplateDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @IsString() subject: string;
  @ApiProperty() @IsString() content: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() variables?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class SendNotificationDto {
  @ApiProperty() @IsString() templateId: string;
  @ApiProperty() @IsString() recipient: string;
  @ApiProperty() @IsString() channel: string;
  @ApiProperty({ required: false }) @IsOptional() variables?: Record<string, string>;
}

export class BroadcastNotificationDto {
  @ApiProperty() @IsString() templateId: string;
  @ApiProperty() @IsString() channel: string;
  @ApiProperty({ required: false }) @IsOptional() variables?: Record<string, string>;
  @ApiProperty() @IsString() tenantId: string;
}

export class CreateReferralLinkDto {
  @ApiProperty() @IsString() referrerId: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class ConvertReferralDto {
  @ApiProperty() @IsString() refereeId: string;
}
