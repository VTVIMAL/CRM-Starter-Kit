import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { HealthService} from "./health.service";
import { HealthController} from "./health.controller";


@Module({
    imports: [PrismaModule],
    providers: [HealthService],
    controllers: [HealthController]
})

export class HealthModule {}