import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/current-user.type';
import { AuthorizationService } from '../auth/authorization.service';
  
  type FindAllContactsParams = {
    q?: string;
    page?: number;
    limit?: number;
    ownerId?: number;
    companyId?: number;
    currentUser: AuthenticatedUser;
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
    constructor(
      private readonly prisma: PrismaService,
      private readonly authorizationService: AuthorizationService,
    ) {}
  
    async findAll({
      q,
      page = 1,
      limit = 10,
      ownerId,
      companyId,
      currentUser,
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
  
      if (companyId !== undefined) {
        where.companyId = companyId;
      }
      if (currentUser.role === Role.ADMIN) {
        if(ownerId !== undefined) {
          where.ownedById = ownerId;
        } 
      } else {
        // non-admin users are always limited to their own contacts
       where.ownedById = currentUser.id;
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
  
    async findOne(id: number, currentUser: AuthenticatedUser) {
      const contact = await this.prisma.contact.findUnique({
        where: { id },
      });
  
      if (!contact) {
        throw new NotFoundException(`Contact with id ${id} not found`);
      }

      if (
        currentUser.role !== Role.ADMIN &&
        contact.ownedById !== currentUser.id
      ) {
        throw new ForbiddenException('You are not allowed to access this content.');
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
        currentUser: AuthenticatedUser,
    ) {

      const existingContact = await this.prisma.contact.findUnique({
        where: {id},
      });

      if (!existingContact) {
        throw new NotFoundException(`Contact with id ${id} not found`);
      }

      this.authorizationService.ensureOwnerResourceAccess(
        currentUser,
        existingContact.ownedById,
        'You are not allowed to update this contact.',
      )

        try {
            return await this.prisma.contact.update({
                where: {id},
                data: 
                  currentUser.role === Role.ADMIN
                    ? data
                    : {
                      ...data,
                      ownedById: undefined,
                    },
            });
        } catch (error) {

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
                throw new NotFoundException(`Contact with id ${id} not found`);
            }
            throw error;
        }
    }
  }