import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ContactsService {

    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.contact.findMany();
    }
}