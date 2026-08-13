import {
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    MinLength,
  } from 'class-validator';
  
  export class CreateContactDto {
    @IsString()
    @MinLength(1)
    firstName!: string;
  
    @IsString()
    @MinLength(1)
    lastName!: string;
  
    @IsEmail()
    email!: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsInt()
    ownedById!: number;
  
    @IsOptional()
    @IsInt()
    companyId?: number;
  }