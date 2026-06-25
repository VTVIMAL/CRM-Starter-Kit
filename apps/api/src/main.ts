import * as path from 'path';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


dotenv.config({
    path: path.resolve(__dirname, '..', '.env'),
});

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const port = process.env.PORT ? Number(process.env.PORT) : 3000;

    await app.listen(port);
}

bootstrap();