import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    MinLength,
  } from 'class-validator';
  import { ActivityType } from '@prisma/client';
  
  export class UpdateActivityDto {
    @IsOptional()
    @IsEnum(ActivityType)
    type?: ActivityType;
  
    @IsOptional()
    @IsString()
    @MinLength(1)
    subject?: string;
  
    @IsOptional()
    @IsString()
    body?: string | null;
  
    @IsOptional()
    @IsInt()
    createdById?: number;
  
    @IsOptional()
    @IsInt()
    contactId?: number | null;
  
    @IsOptional()
    @IsInt()
    companyId?: number | null;
  
    @IsOptional()
    @IsInt()
    dealId?: number | null;
  }