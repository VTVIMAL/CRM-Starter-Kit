import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
  import { DealStage } from '@prisma/client';
  import { DealsService } from './deals.service';

  @Controller('deals')
  export class DealsController {
    constructor(private readonly dealsService: DealsService) {}

    @Get()
    findAll(
        @Query('q') q?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
        @Query('ownerId') ownerId?: string,
        @Query('companyId') companyId?: string,
        @Query('contactId') contactId?: string,
        @Query('stage') stage?: DealStage,  
    ) {
        return this.dealsService.findAll({
            q,
            page,
            limit,
            ownerId: ownerId ? Number(ownerId) : undefined,
            companyId: companyId ? Number(companyId) : undefined,
            contactId: contactId ? Number(contactId) : undefined,
            stage,
        });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.dealsService.findOne(id);
    }

    @Post()
    create(
        @Body()
        body: {
            title: string;
            value: number | string;
            currency: string;
            stage?: DealStage;
            expectedCloseDate?: string;
            ownedById: number;
            companyId?: number;
            contactId?: number;
        },
    ) {
        return this.dealsService.create(body);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        body: {
            title?: string;
            value?: number | string;
            currency?: string;
            stage?: DealStage;
            expectedCloseDate?: string | null;
            ownedById?: number;
            companyId?: number | null;
            contactId?: number | null;
        },
    ) {
        return this.dealsService.update(id, body)
    }

    // @Delete(':id')
    // remove(@Param('id', ParseIntPipe) id:number) {
    //     return this.dealsService.remove(id);
    // }
  }