import * as path from 'path';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


dotenv.config({
    path: path.join(__dirname, '..', '.env'),
    // path: path.resolve(process.cwd(), 'apps/api/.env'),
});

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,  // removes fields not in DTO
            forbidNonWhitelisted: true, // throws error instead of accepting extra fields
            transform: true, // helps convert values to expected types
        }),
    );

    const port = process.env.PORT ? Number(process.env.PORT) : 3000;

    await app.listen(port);
}

bootstrap();