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
import { DealStage, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedUser } from '../auth/current-user.type';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('deals')
  export class DealsController {
    constructor(private readonly dealsService: DealsService) {}

    @Get()
    findAll(
        @CurrentUser() user: AuthenticatedUser,
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
            currentUser: user,
        });
    }

    @Get(':id')
    findOne(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.dealsService.findOne(id, user);
    }

    @Post()
    create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() body: CreateDealDto
    ) {
        return this.dealsService.create({
            ...body,
            ownedById: user.role === Role.ADMIN && body.ownedById ? body.ownedById : user.id,
        });
    }

    @Patch(':id')
    update(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateDealDto,
    ) {
        return this.dealsService.update(id, body, user);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id:number) {
        return this.dealsService.remove(id);
    }
  }