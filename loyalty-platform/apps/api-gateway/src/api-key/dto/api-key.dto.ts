import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() @IsString({ each: true }) permissions?: string[];
}

export class RegenerateApiKeyDto {
  @ApiProperty() @IsString() id: string;
}
