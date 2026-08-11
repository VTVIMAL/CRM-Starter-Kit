import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

type CreateUserParams = {
    email: string;
    passwordHash: string;
    role?: Role;
};

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    
    async create({email, passwordHash, role = 'USER'}: CreateUserParams) {
        try {
            return await this.prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    role,
                }
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2002'
            ) {
                throw new BadRequestException('A user with this email already exists.');
            }

            throw error;
        }
    }
}