import { IsEmail, IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateContactDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    firstname?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    ownedById?: number;

    @IsOptional()
    @IsInt()
    companyId?: number | null;
}