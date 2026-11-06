import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CompaniesService } from "./companies.service";
import { CompaniesController } from "./companies.controller";


@Module({
    imports: [PrismaModule],
    controllers: [CompaniesController],
    providers: [CompaniesService],
})
export class CompaniesModule {}
