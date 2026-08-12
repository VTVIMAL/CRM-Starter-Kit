import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { ActivityType, Prisma } from '@prisma/client';
  import { PrismaService } from '../prisma/prisma.service';
  
  type FindAllActivitiesParams = {
    page?: number;
    limit?: number;
    createdById?: number;
    contactId?: number;
    companyId?: number;
    dealId?: number;
    type?: ActivityType;
  };
  
  @Injectable()
  export class ActivitiesService {
    constructor(private readonly prisma: PrismaService) {}
  
    async findAll({
      page = 1,
      limit = 10,
      createdById,
      contactId,
      companyId,
      dealId,
      type,
    }: FindAllActivitiesParams) {
      const skip = (page - 1) * limit;
  
      const where: Prisma.ActivityWhereInput = {};
  
      if (createdById !== undefined) {
        where.createdById = createdById;
      }
  
      if (contactId !== undefined) {
        where.contactId = contactId;
      }
  
      if (companyId !== undefined) {
        where.companyId = companyId;
      }
  
      if (dealId !== undefined) {
        where.dealId = dealId;
      }
  
      if (type !== undefined) {
        where.type = type;
      }
  
      const data = await this.prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          contact: true,
          company: true,
          deal: true,
        },
      });
  
      const total = await this.prisma.activity.count({ where });
  
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
      const activity = await this.prisma.activity.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          contact: true,
          company: true,
          deal: true,
        },
      });
  
      if (!activity) {
        throw new NotFoundException(`Activity with id ${id} not found`);
      }
  
      return activity;
    }
  
    async create(data: {
      type: ActivityType;
      subject: string;
      body?: string;
      createdById: number;
      contactId?: number;
      companyId?: number;
      dealId?: number;
    }) {
      try {
        return await this.prisma.activity.create({
          data: {
            type: data.type,
            subject: data.subject,
            body: data.body,
            createdById: data.createdById,
            contactId: data.contactId,
            companyId: data.companyId,
            dealId: data.dealId,
          },
          include: {
            createdBy: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
            contact: true,
            company: true,
            deal: true,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2003'
        ) {
          throw new BadRequestException(
            'Invalid createdById, contactId, companyId, or dealId. Related record does not exist.',
          );
        }
  
        throw error;
      }
    }
  
    async update(
      id: number,
      data: {
        type?: ActivityType;
        subject?: string;
        body?: string | null;
        createdById?: number;
        contactId?: number | null;
        companyId?: number | null;
        dealId?: number | null;
      },
    ) {
      try {
        return await this.prisma.activity.update({
          where: { id },
          data: {
            type: data.type,
            subject: data.subject,
            body: data.body,
            createdById: data.createdById,
            contactId: data.contactId,
            companyId: data.companyId,
            dealId: data.dealId,
          },
          include: {
            createdBy: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
            contact: true,
            company: true,
            deal: true,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException(`Activity with id ${id} not found`);
        }
  
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2003'
        ) {
          throw new BadRequestException(
            'Invalid createdById, contactId, companyId, or dealId. Related record does not exist.',
          );
        }
  
        throw error;
      }
    }
  }