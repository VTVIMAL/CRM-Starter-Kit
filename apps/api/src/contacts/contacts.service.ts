import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type FindAllContactsParams = {
  q?: string;
  page?: number;
  limit?: number;
  ownerId?: number;
  companyId?: number;
};

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    q,
    page = 1,
    limit = 10,
    ownerId,
    companyId,
  }: FindAllContactsParams) {
    const search = q?.trim();
    const skip = (page - 1) * limit;

    // Start with an empty filter object.
    const where: Prisma.ContactWhereInput = {};

    // Add text search only if q exists.
    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Add owner filter only when ownerId exists.
    if (ownerId !== undefined) {
      where.ownedById = ownerId;
    }

    // Add company filter only when companyId exists.
    if (companyId !== undefined) {
      where.companyId = companyId;
    }

    const data = await this.prisma.contact.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        company: true,
        ownedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const total = await this.prisma.contact.count({
      where,
    });

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
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
        ownedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        deals: true,
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        activities: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }

    return contact;
  }
}