import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EarnPointsDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @IsNumber() @Min(1) amount: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() reason?: string;
}

export class BurnPointsDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @IsNumber() @Min(1) amount: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() reason?: string;
}

export class PointsQueryDto {
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
}
