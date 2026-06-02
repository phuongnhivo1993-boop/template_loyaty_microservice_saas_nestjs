import { IsString, IsEmail, IsOptional, IsDateString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() fullName: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() birthday?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiProperty() @IsString() tenantId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tierId?: string;
}

export class UpdateMemberDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() fullName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() birthday?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiProperty({ required: false }) @IsOptional() @IsString() tierId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class MemberQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tierId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString({ each: true }) tags?: string[];
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
}

export class RegisterMemberDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() fullName: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantDomain?: string;
}
