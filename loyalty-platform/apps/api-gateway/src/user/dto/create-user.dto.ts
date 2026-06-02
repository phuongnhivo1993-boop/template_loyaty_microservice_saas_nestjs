import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(6) password: string;
  @ApiProperty() @IsString() fullName: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() role?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class UpdateUserDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() fullName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() role?: string;
}

export class UserQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
}
