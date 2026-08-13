import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
  import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
  
  @Controller('tasks')
  export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
  
    @Get()
    findAll(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
      @Query('assignedToId') assignedToId?: string,
      @Query('contactId') contactId?: string,
      @Query('companyId') companyId?: string,
      @Query('dealId') dealId?: string,
      @Query('completed') completed?: string,
    ) {
      return this.tasksService.findAll({
        page,
        limit,
        assignedToId: assignedToId ? Number(assignedToId) : undefined,
        contactId: contactId ? Number(contactId) : undefined,
        companyId: companyId ? Number(companyId) : undefined,
        dealId: dealId ? Number(dealId) : undefined,
        completed:
        completed === undefined
          ? undefined
          : completed === 'true',
      });
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.tasksService.findOne(id);
    }
  
    @Post()
    create(@Body() body: CreateTaskDto) {
      return this.tasksService.create(body);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: UpdateTaskDto,
    ) {
      return this.tasksService.update(id, body);
    }
  }