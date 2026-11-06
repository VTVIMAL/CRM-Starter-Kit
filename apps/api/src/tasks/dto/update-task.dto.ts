import {
    IsBoolean,
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    MinLength,
  } from 'class-validator';
  
  export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string;
  
    @IsOptional()
    @IsDateString()
    dueDate?: string | null;
  
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
  
    @IsOptional()
    @IsInt()
    assignedToId?: number;
  
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