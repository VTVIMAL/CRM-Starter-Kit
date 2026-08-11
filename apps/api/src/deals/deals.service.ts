import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { Prisma, DealStage } from '@prisma/client';
  import { PrismaService } from '../prisma/prisma.service';
  
  type FindAllDealsParams = {
    q?: string;
    page?: number;
    limit?: number;
    ownerId?: number;
    companyId?: number;
    contactId?: number;
    stage?: DealStage;
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
  
      if (ownerId !== undefined) {
        where.ownedById = ownerId;
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
  
    async findOne(id: number) {
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
  }