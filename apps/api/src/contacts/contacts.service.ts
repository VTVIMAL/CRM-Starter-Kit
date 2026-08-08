import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type FindAllContactsParams = {
    q?: string;
    page?: number;
    limit?: number;
}

@Injectable()
export class ContactsService {

    constructor( private readonly prisma: PrismaService ) {}

    async findAll({
        q,
        page = 1,
        limit = 10,
    }: FindAllContactsParams) {

        const search = q?.trim();

        const skip = (page - 1) * limit;
        // search filter for only when a search term exists 

        const where = search
        ? {
            OR: [
                {
                    firstName: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
                {
                    lastName: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
                {
                    email: {
                        contains: search, 
                        mode: 'insensitive' as const,
                    },
                },
            ],
        }
        : undefined;

        // Fetch paginated contact rows from the database 
        const data = await this.prisma.contact.findMany({
            where, 
            skip,
            take: limit, // how many rows to return
            orderBy: {
                createdAt: 'desc'
            }
        });

        // count the total number of contacts
        const total = await this.prisma.contact.count({
            where,
        });

        // return the data 
        return {
            data,
            meta: {
                page,
                limit, 
                total,
                totalPages: Math.ceil(total/ limit),
            },
        };

    }

    // SERVICE receives a pure number
    async findOne(id: number) {
         // Prisma is happy because the types match perfectly
        const contact = await this.prisma.contact.findUnique({
            where: {id},
            // currently returns null if contact object not found,
            // replace with 404 page in the future 
        });

        if (!contact) {
            throw new NotFoundException(`Contact with id ${id} not found`);
        }

        return contact;
    }
   
}