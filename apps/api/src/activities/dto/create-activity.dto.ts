import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    MinLength,
  } from 'class-validator';
  import { ActivityType } from '@prisma/client';
  
  export class CreateActivityDto {
    @IsEnum(ActivityType)
    type!: ActivityType;
  
    @IsString()
    @MinLength(1)
    subject!: string;
  
    @IsOptional()
    @IsString()
    body?: string;
  
    @IsInt()
    createdById!: number;
  
    @IsOptional()
    @IsInt()
    contactId?: number;
  
    @IsOptional()
    @IsInt()
    companyId?: number;
  
    @IsOptional()
    @IsInt()
    dealId?: number;
  }