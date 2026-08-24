import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, Role } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

type CreateUserParams = {
    email: string;
    passwordHash: string;
    role?: Role;
};

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(data: CreateUserDto) {
        const passwordHash = await bcrypt.hash(data.password, 10);

        try {
            return await this.prisma.user.create({
                data: {
                    email: data.email,
                    passwordHash,
                    role: data.role,
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
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

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    async findPublicById(id: number) {
        return this.prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
}