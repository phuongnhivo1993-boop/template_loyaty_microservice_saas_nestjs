import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateVoucherDto {
  @ApiProperty({ description: 'Voucher code to validate' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;
}
