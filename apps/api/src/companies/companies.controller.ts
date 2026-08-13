import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompayDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

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
    create(@Body() body: CreateCompayDto ) {
        return this.companiesService.create(body)
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateCompanyDto,
    ) {
        return this.companiesService.update(id, body);
    }
}
