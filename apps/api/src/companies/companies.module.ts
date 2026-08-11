import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CompaniesService } from "./companies.service";
import { CompaniesContoller } from "./companies.controller";


@Module({
    imports: [PrismaModule],
    controllers: [CompaniesContoller],
    providers: [CompaniesService],
})
export class CompaniesModule {}
