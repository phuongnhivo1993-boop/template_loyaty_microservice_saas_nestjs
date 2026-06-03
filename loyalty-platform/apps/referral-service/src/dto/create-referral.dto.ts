import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReferralDto {
  @ApiProperty({ description: 'Referrer member ID' })
  @IsString()
  @IsNotEmpty()
  referrerId: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({ description: 'Custom referral code (auto-generated if omitted)' })
  @IsString()
  @IsOptional()
  code?: string;
}
