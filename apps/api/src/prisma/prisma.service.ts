import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    // when Nest creates the service, run the setup
    constructor(private readonly configService: ConfigService) {

        const connectionString = configService.get<string>('DATABASE_URL');

        // check if DATABASE_URL is present else fail 
        if (!connectionString) {
            throw new Error("DATABASE_URL is not defined");
        }

        const pool = new Pool({
            // create the PostgresSQL connection pool
            connectionString,
        });

        // bridge between Prisma and pg
        const adapter = new PrismaPg(pool);


        // initialize PrismaClient 
        super({
            adapter,
        });
    } 

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}

