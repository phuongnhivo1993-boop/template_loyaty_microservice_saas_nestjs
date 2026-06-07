import { IsString, IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty()
  @IsString()
  memberId: string;

  @ApiProperty()
  @IsString()
  entityType: string;

  @ApiProperty()
  @IsString()
  entityId: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false, enum: ['PUBLISHED', 'DRAFT', 'REJECTED', 'PENDING'] })
  @IsOptional()
  @IsString()
  @IsIn(['PUBLISHED', 'DRAFT', 'REJECTED', 'PENDING'])
  status?: string;
}

export class UpdateFeedbackDto {
  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false, enum: ['PUBLISHED', 'DRAFT', 'REJECTED', 'PENDING'] })
  @IsOptional()
  @IsString()
  @IsIn(['PUBLISHED', 'DRAFT', 'REJECTED', 'PENDING'])
  status?: string;
}
