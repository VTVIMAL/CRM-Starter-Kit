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
    UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedUser } from '../auth/current-user.type';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
  
@UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('tasks')
  export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
  
    @Get()
    findAll(
      @CurrentUser() user: AuthenticatedUser,
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
        currentUser: user,
      });
    }
  
    @Get(':id')
    findOne(
      @CurrentUser() user: AuthenticatedUser,
      @Param('id', ParseIntPipe) id: number
    ) {
      return this.tasksService.findOne(id, user);
    }
  
    @Post()
    create(
      @CurrentUser() user: AuthenticatedUser,
      @Body() body: CreateTaskDto
    ) {
      return this.tasksService.create({
        ...body,
        assignedToId:
          user.role === Role.ADMIN && body.assignedToId ? body.assignedToId : user.id,
      });
    }
  
    @Patch(':id')
    update(
      @CurrentUser() user: AuthenticatedUser,
      @Param('id', ParseIntPipe) id: number,
      @Body() body: UpdateTaskDto,
    ) {
      return this.tasksService.update(id, body, user);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.tasksService.remove(id);
    }
  }