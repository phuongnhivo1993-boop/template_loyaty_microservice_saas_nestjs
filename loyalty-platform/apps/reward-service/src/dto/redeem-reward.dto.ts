import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RedeemRewardDto {
  @ApiProperty({ description: 'Member ID redeeming the reward' })
  @IsString()
  @IsNotEmpty()
  memberId: string;
}
