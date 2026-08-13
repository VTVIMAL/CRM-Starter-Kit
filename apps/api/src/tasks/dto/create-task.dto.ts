import {
    IsBoolean,
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    MinLength,
  } from 'class-validator';
  
  export class CreateTaskDto {
    @IsString()
    @MinLength(1)
    title!: string;
  
    @IsOptional()
    @IsDateString()
    dueDate?: string;
  
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
  
    @IsInt()
    assignedToId!: number;
  
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