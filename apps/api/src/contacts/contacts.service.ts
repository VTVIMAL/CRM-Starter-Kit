import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ContactsService {

    constructor( private readonly prisma: PrismaService ) {}

    // async findAll() {
    //     return this.prisma.contact.findMany();
    // }

    async findAll(q?: string) {

        const search = q?.trim(); // remove whitespaces

        if(!search) {
            // return all contacts if not search term is provided.
            return this.prisma.contact.findMany();
        }

        return this.prisma.contact.findMany({
            where: { // only return rows meeting the given conditions.
                OR: [ // if one of these conditions meet return it.
                    {
                        firstName: {
                            contains: search,
                            mode: 'insensitive'
                        },
                        lastName: {
                            contains: search,
                            mode: 'insensitive'
                        },
                        email: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        });
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