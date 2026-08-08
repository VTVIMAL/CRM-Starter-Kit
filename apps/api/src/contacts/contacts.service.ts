import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ContactsService {

    constructor( private readonly prisma: PrismaService ) {}

    async findAll({
        q, 
        page = 1,
        limit = 10,
    }: {
        q?: string;
        page?: number;
        limit?: number;
    }) {
        const search = q?.trim(); // remove whitespaces
        // calculate how many records to skip based on the page and limit 
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

        const [data, total] = await Promise.all([
            this.prisma.contact.findMany({
                where,
                skip,
                take: limit,
            }),
            this.prisma.contact.count({
                where,
            }),
        ]);

        // return the data 
        return {
            data,
            meta: {
                page,
                limit, 
                total,
            },
        };

    }

    // SERVICE receives a pure number
    async findOne(id: number) {
         // Prisma is happy because the types match perfectly
        return this.prisma.contact.findUnique({
            where: {id},

            // currently returns null if contact object not found,
            // replace with 404 page in the future 
        })
    }
   
}