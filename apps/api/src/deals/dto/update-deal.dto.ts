import {
    IsDateString,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    MinLength,
  } from 'class-validator';
  import { DealStage } from '@prisma/client';
  
  export class UpdateDealDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string;
  
    @IsOptional()
    @IsNumber()
    @Min(0)
    value?: number;
  
    @IsOptional()
    @IsString()
    @MinLength(1)
    currency?: string;
  
    @IsOptional()
    @IsEnum(DealStage)
    stage?: DealStage;
  
    @IsOptional()
    @IsDateString()
    expectedCloseDate?: string | null;
  
    @IsOptional()
    @IsInt()
    ownedById?: number;
  
    @IsOptional()
    @IsInt()
    companyId?: number | null;
  
    @IsOptional()
    @IsInt()
    contactId?: number | null;
  }