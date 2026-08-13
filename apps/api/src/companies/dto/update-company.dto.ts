import {
    IsInt,
    IsOptional,
    IsString,
    Min,
    MinLength,
  } from 'class-validator';


export class UpdateCompanyDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    name?: string;
    
    @IsOptional()
    @IsString()
    domain?: string | null;

    @IsOptional()
    @IsString()
    @MinLength(1)
    industry?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    size?: number | null;

    @IsOptional()
    @IsInt()
    ownedById?: number;
}