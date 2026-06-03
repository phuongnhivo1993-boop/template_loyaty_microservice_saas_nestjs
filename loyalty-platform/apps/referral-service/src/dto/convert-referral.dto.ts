import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ConvertReferralDto {
  @ApiProperty({ description: 'Referee member ID' })
  @IsString()
  @IsNotEmpty()
  refereeId: string;
}
