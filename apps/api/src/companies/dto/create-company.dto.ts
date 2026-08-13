import {
    IsInt,
    IsOptional,
    IsString,
    Min,
    MinLength,
  } from 'class-validator';


export class CreateCompayDto {
    @IsString()
    @MinLength(1)
    name!: string;

    @IsOptional()
    @IsString()
    domain?: string;

    @IsString()
    @MinLength(1)
    industry!: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    size?: number;

    @IsInt()
    ownedById!: number;
}