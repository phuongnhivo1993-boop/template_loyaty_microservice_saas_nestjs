import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() domain: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty() @IsString() hostId: string;
}

export class UpdateTenantDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class TenantQueryDto {
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
}
