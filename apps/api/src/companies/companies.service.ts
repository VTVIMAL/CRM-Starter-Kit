import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuthenticatedUser } from "../auth/current-user.type";


type FindAllCompaniesParams = {
    q?: string;
    page?: number;
    limit?: number;
    ownerId?: number;
    currentUser: AuthenticatedUser;
}

@Injectable()
export class CompaniesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll({
        q,
        page = 1,
        limit = 10,
        ownerId,
        currentUser,
    }: FindAllCompaniesParams) {
        const search = q?.trim();
        const skip = (page - 1) * limit;

        const where: Prisma.CompanyWhereInput = {};

        if(search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    },
                },
                {
                    domain: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    industry: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ];
        }

        if (currentUser.role == Role.ADMIN) {
            if(ownerId !== undefined) {
                where.ownedById = ownerId;
            }
        } else {
            where.ownedById = currentUser.id;
        }

        const data = await this.prisma.company.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                ownedBy: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        const total = await this.prisma.company.count({ where });

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number, currentUser: AuthenticatedUser) {
        const company = await this.prisma.company.findUnique({
            where: {id},
            include: {
                ownedBy: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                contacts: true,
            },
        });

        if (!company) {
            throw new NotFoundException(`Company with id ${id} not found`);
        }

        if (
            currentUser.role !== Role.ADMIN &&
            company.ownedById !== currentUser.id
        ) {
            throw new ForbiddenException('You are not allowed to access this company.');
        }

        return company;
    }

    async create(data: {
        name: string;
        domain?: string;
        industry: string;
        size?: number;
        ownedById: number;
    }) {
        try {
            return await this.prisma.company.create({
                data,
                include: {
                    ownedBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2003'
            ) {
                throw new BadRequestException(
                    'Invalid ownedById, Related user does not exist.',
                );
            }
            throw error;
        }
    }

    async update(
        id: number,
        data: {
            name?: string;
            domain?: string | null;
            industry?: string;
            size?: number | null;
            ownedById?: number;
        },
        currentUser: AuthenticatedUser,
    ) {
        const existingCompany = await this.prisma.company.findUnique({
            where: {id},
        });

        if(!existingCompany) {
            throw new NotFoundException(`Company with id ${id} not found`);
        }

        if (
            currentUser.role !== Role.ADMIN &&
            existingCompany.ownedById !== currentUser.id
        ) {
            throw new ForbiddenException('You are not allowed to update this company.')
        }

        try {
            return await this.prisma.company.update({
                where: {id},
                data: currentUser.role == Role.ADMIN
                    ? data
                    : {
                        ...data,
                        ownedById: undefined,
                    },
                include: {
                    ownedBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });
        } catch (error) {

            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2003'
            ) {
                throw new BadRequestException(
                    'Invalid ownedById. Realted user does not exist.',
                );
            }

            throw error;
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.company.delete({
                where: { id },
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException(`Company with id ${id} not found`)
            }

            throw error;
        }
    } 
}

