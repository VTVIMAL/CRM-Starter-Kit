import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesContoller {
    constructor(private readonly companiesService: CompaniesService) {}

    @Get()
    findAll(
        @Query('q') q?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
        @Query('ownerId') ownerId?: string,
    ) {
        return this.companiesService.findAll({
            q,
            page,
            limit,
            ownerId: ownerId ? Number(ownerId) : undefined,
        });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.companiesService.findOne(id);
    }

    @Post()
    create(
        @Body()
        body: {
            name: string;
            domain?: string;
            industry: string;
            size?: number;
            ownedById: number;
        },
    ) {
        return this.companiesService.create(body)
    }
}
