import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { Prisma } from '@prisma/client';
  import { PrismaService } from '../prisma/prisma.service';


type FindAllTasksParams = {
    page?: number;
    limit?: number;
    assignedToId?: number;
    contactId?: number;
    companyId?: number;
    dealId?: number;
    completed?: boolean;
};

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll({
        page = 1,
        limit = 10,
        assignedToId,
        contactId,
        companyId,
        dealId,
        completed,
    }: FindAllTasksParams) {
        const skip = (page -1) * limit;

        const where: Prisma.TaskWhereInput = {};

        if (assignedToId !== undefined) {
            where.assignedToId = assignedToId;
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

        if (completed !== undefined) {
            where.completed = completed;
        }

        const data = await this.prisma.task.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                assignedTo: {
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

        const total = await this.prisma.task.count({ where });

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
        const task = await this.prisma.task.findUnique({
            where: {id},
            include: {
                assignedTo: {
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

        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }

        return task;
    }

    async create(data: {
        title: string;
        dueDate?: string;
        completed?: boolean;
        assignedToId: number;
        contactId?: number;
        companyId?: number;
        dealId?: number;

    }) {
        try {
            return await this.prisma.task.create({
                data: {
                    title: data.title,
                    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
                    completed: data.completed ?? false,
                    assignedToId: data.assignedToId,
                    contactId: data.contactId,
                    companyId: data.companyId,
                    dealId: data.dealId,
                  },
                  include: {
                    assignedTo: {
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
                    'Invalid assignedToId, contactId, companyId, or dealId. Related record does not exist.',
                );
            }

            throw error;
        }
    }
    async update(
        id: number,
        data: {
          title?: string;
          dueDate?: string | null;
          completed?: boolean;
          assignedToId?: number;
          contactId?: number | null;
          companyId?: number | null;
          dealId?: number | null;
        },
      ) {
        try {
          return await this.prisma.task.update({
            where: { id },
            data: {
              title: data.title,
              dueDate:
                data.dueDate === null
                  ? null
                  : data.dueDate
                    ? new Date(data.dueDate)
                    : undefined,
              completed: data.completed,
              assignedToId: data.assignedToId,
              contactId: data.contactId,
              companyId: data.companyId,
              dealId: data.dealId,
            },
            include: {
              assignedTo: {
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
            throw new NotFoundException(`Task with id ${id} not found`);
          }
    
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2003'
          ) {
            throw new BadRequestException(
              'Invalid assignedToId, contactId, companyId, or dealId. Related record does not exist.',
            );
          }
    
          throw error;
        }
    }
}
