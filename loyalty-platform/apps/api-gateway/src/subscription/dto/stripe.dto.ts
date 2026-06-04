import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutSessionDto {
  @ApiProperty({ enum: ['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'] })
  @IsString()
  plan: string;

  @ApiProperty()
  @IsString()
  successUrl: string;

  @ApiProperty()
  @IsString()
  cancelUrl: string;
}

export class CreatePortalSessionDto {
  @ApiProperty()
  @IsString()
  returnUrl: string;
}

export class StripeWebhookDto {
  @ApiProperty()
  @IsString()
  signature: string;

  @ApiProperty()
  @IsString()
  payload: string;
}
