import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { Prisma, DealStage, Role } from '@prisma/client';
  import { PrismaService } from '../prisma/prisma.service';
  import { AuthenticatedUser } from '../auth/current-user.type';
  
  type FindAllDealsParams = {
    q?: string;
    page?: number;
    limit?: number;
    ownerId?: number;
    companyId?: number;
    contactId?: number;
    stage?: DealStage;
    currentUser: AuthenticatedUser;
  };
  
  @Injectable()
  export class DealsService {
    constructor(private readonly prisma: PrismaService) {}
  
    async findAll({
      q,
      page = 1,
      limit = 10,
      ownerId,
      companyId,
      contactId,
      stage,
      currentUser,
    }: FindAllDealsParams) {
      const search = q?.trim();
      const skip = (page - 1) * limit;
  
      const where: Prisma.DealWhereInput = {};
  
      if (search) {
        where.OR = [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            currency: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }
  
      if (companyId !== undefined) {
        where.companyId = companyId;
      }
  
      if (contactId !== undefined) {
        where.contactId = contactId;
      }
  
      if (stage !== undefined) {
        where.stage = stage;
      }

      if (currentUser.role === Role.ADMIN) {
        if (ownerId !== undefined) {
          where.ownedById = ownerId;
        }
      } else {
        where.ownedById = currentUser.id;
      }
  
      const data = await this.prisma.deal.findMany({
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
          company: true,
          contact: true,
        },
      });
  
      const total = await this.prisma.deal.count({ where });
  
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
      const deal = await this.prisma.deal.findUnique({
        where: { id },
        include: {
          ownedBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          company: true,
          contact: true,
          tasks: true,
          activities: true,
        },
      });
  
      if (!deal) {
        throw new NotFoundException(`Deal with id ${id} not found`);
      }

      if (currentUser.role !== Role.ADMIN && deal.ownedById !== currentUser.id) {
        throw new ForbiddenException('You are not allowed to access this deal.');
      }
  
      return deal;
    }
  
    async create(data: {
      title: string;
      value: Prisma.Decimal | number | string;
      currency: string;
      stage?: DealStage;
      expectedCloseDate?: string;
      ownedById: number;
      companyId?: number;
      contactId?: number;
    }) {
      try {
        return await this.prisma.deal.create({
          data: {
            title: data.title,
            value: data.value,
            currency: data.currency,
            stage: data.stage ?? DealStage.LEAD,
            expectedCloseDate: data.expectedCloseDate
              ? new Date(data.expectedCloseDate)
              : undefined,
            ownedById: data.ownedById,
            companyId: data.companyId,
            contactId: data.contactId,
          },
          include: {
            ownedBy: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
            company: true,
            contact: true,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2003'
        ) {
          throw new BadRequestException(
            'Invalid ownedById, companyId, or contactId. Related record does not exist.',
          );
        }
  
        throw error;
      }
    }

    async update(
        id: number,
        data: {
            title?: string;
            value?: Prisma.Decimal | number | string;
            currency?: string;
            stage?: DealStage;
            expectedCloseDate?: string | null;
            ownedById?: number;
            companyId?: number | null;
            contactId?: number | null;
        },
        currentUser: AuthenticatedUser,
    ) {

      const existingDeal = await this.prisma.deal.findUnique({
        where: { id },
      });

      if (!existingDeal) {
        throw new NotFoundException(`Deal with id ${id} not found.`)
      }

      if (
        currentUser.role !== Role.ADMIN &&
        existingDeal.ownedById !== currentUser.id
      ) {
        throw new ForbiddenException('You are not allowed to update this deal.');
      }

        try {
            return await this.prisma.deal.update({
                where: { id },
                data: {
                    title: data.title,
                    value: data.value,
                    currency: data.currency,
                    stage: data.stage,
                    expectedCloseDate:
                        data.expectedCloseDate === null
                            ? null
                            : data.expectedCloseDate
                                ? new Date(data.expectedCloseDate)
                                : undefined,
                    ownedById: currentUser.role === Role.ADMIN ? data.ownedById: undefined,
                    companyId: data.companyId,
                    contactId: data.contactId,
                },
                include: {
                    ownedBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    company: true,
                    contact: true,
                },
            });
        } catch (error) {
            
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2003'
            ) {
                throw new BadRequestException(
                    'Invalid ownedById, companyId or contactId, Related record does not exist.',
                );
            }
            throw error;
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.deal.delete({
                where: {id},
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException(`Deal with id ${id} not found`);
            }
            throw error;
        }
    }
  }