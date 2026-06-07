import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsDateString, IsArray, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MemberStatus } from '@prisma/client';

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
  @ApiProperty({ required: false, enum: MemberStatus }) @IsOptional() @IsEnum(MemberStatus) status?: MemberStatus;
}

export class MemberQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
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
