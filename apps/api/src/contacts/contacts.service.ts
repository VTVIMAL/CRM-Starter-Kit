import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { Prisma } from '@prisma/client';
  import { PrismaService } from '../prisma/prisma.service';
  
  type FindAllContactsParams = {
    q?: string;
    page?: number;
    limit?: number;
    ownerId?: number;
    companyId?: number;
  };
  
  type CreateContactParams = {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    ownedById: number;
    companyId?: number;
  };

  type UpdateContactParams = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    ownedById?: number;
    companyId?: number | null;
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
  
      const where: Prisma.ContactWhereInput = {};
  
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
  
      if (ownerId !== undefined) {
        where.ownedById = ownerId;
      }
  
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
      });
  
      const total = await this.prisma.contact.count({ where });
  
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
      });
  
      if (!contact) {
        throw new NotFoundException(`Contact with id ${id} not found`);
      }
  
      return contact;
    }
  
    async create({
      firstName,
      lastName,
      email,
      phone,
      ownedById,
      companyId,
    }: CreateContactParams) {
      try {
        return await this.prisma.contact.create({
          data: {
            firstName,
            lastName,
            email,
            phone,
            ownedById,
            companyId,
          },
        });
      } catch (error) {
        // Prisma foreign key problems often mean the related User/Company does not exist.
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2003'
        ) {
          throw new BadRequestException(
            'Invalid ownedById or companyId. Related record does not exist.',
          );
        }
  
        throw error;
      }
    }

    async update(
        id: number, 
        data: {
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string | null;
            ownedById?: number;
            companyId?: number | null;
        },
    ) {
        try {
            return await this.prisma.contact.update({
                where: {id},
                data,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
            ) {
                throw new NotFoundException('Contact with id ${id} not found');
            }

            if (
                error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'
            ) {
                throw new BadRequestException(
                    'Invalid ownedById or companyId. Related record does not exist.',
                );
            }

            throw error;
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.contact.delete({
                where: { id },
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
            ) {
                throw new NotFoundException('Contact with id ${id} not found');
            }
            throw error;
        }
    }
  }