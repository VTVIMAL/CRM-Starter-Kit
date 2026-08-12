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
  import { ActivityType } from '@prisma/client';
  import { ActivitiesService } from './activities.service';
  
  @Controller('activities')
  export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) {}
  
    @Get()
    findAll(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
      @Query('createdById') createdById?: string,
      @Query('contactId') contactId?: string,
      @Query('companyId') companyId?: string,
      @Query('dealId') dealId?: string,
      @Query('type') type?: ActivityType,
    ) {
      return this.activitiesService.findAll({
        page,
        limit,
        createdById: createdById ? Number(createdById) : undefined,
        contactId: contactId ? Number(contactId) : undefined,
        companyId: companyId ? Number(companyId) : undefined,
        dealId: dealId ? Number(dealId) : undefined,
        type,
      });
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.activitiesService.findOne(id);
    }
  
    @Post()
    create(
      @Body()
      body: {
        type: ActivityType;
        subject: string;
        body?: string;
        createdById: number;
        contactId?: number;
        companyId?: number;
        dealId?: number;
      },
    ) {
      return this.activitiesService.create(body);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body()
      body: {
        type?: ActivityType;
        subject?: string;
        body?: string | null;
        createdById?: number;
        contactId?: number | null;
        companyId?: number | null;
        dealId?: number | null;
      },
    ) {
      return this.activitiesService.update(id, body);
    }
  }