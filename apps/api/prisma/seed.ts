import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({
    connectionString,
})

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
})


async function main() {
    const email = 'dev@example.com';
    const passwordHash = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash,
            role: Role.ADMIN,
        },
        create: {
            email,
            passwordHash,
            role: Role.ADMIN
        },
    });

    console.log('Seeded dev user: dev@example.com / password123');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });