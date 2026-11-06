import {
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    MinLength,
    IsDateString,
  } from 'class-validator';
import { DealStage } from '@prisma/client';

export class CreateDealDto {
    @IsString()
    @MinLength(1)
    title!: string;

    @IsNumber()
    @Min(0)
    value!: number;

    @IsString()
    @MinLength(1)
    currency!: string;

    @IsOptional()
    @IsEnum(DealStage)
    stage?: DealStage;

    @IsOptional()
    @IsDateString()
    expectedCloseDate?: string;

    @IsInt()
    ownedById!: number;
    
    @IsOptional()
    @IsInt()
    companyId?: number;

    @IsOptional()
    @IsInt()
    contactId?:number;
}