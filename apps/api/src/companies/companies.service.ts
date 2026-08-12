import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";


type FindAllCompaniesParams = {
    q?: string;
    page?: number;
    limit?: number;
    ownerId?: number;
}

@Injectable()
export class CompaniesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll({
        q,
        page = 1,
        limit = 10,
        ownerId,
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

        if (ownerId !== undefined) {
            where.ownedById = ownerId;
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

    async findOne(id: number) {
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
}

