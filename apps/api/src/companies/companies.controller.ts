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
  import { CompaniesService } from './companies.service';
  import { CreateCompayDto } from './dto/create-company.dto';
  import { UpdateCompanyDto } from './dto/update-company.dto';
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('companies')
  export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}
  
    @Get()
    findAll(
      @CurrentUser() user: AuthenticatedUser,
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
        currentUser: user,
      });
    }
  
    @Get(':id')
    findOne(
      @CurrentUser() user: AuthenticatedUser,
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.companiesService.findOne(id, user);
    }
  
    @Post()
    create(
      @CurrentUser() user: AuthenticatedUser,
      @Body() body: CreateCompayDto,
    ) {
      return this.companiesService.create({
        ...body,
        ownedById: user.role === Role.ADMIN && body.ownedById ? body.ownedById : user.id,
      });
    }
  
    @Patch(':id')
    update(
      @CurrentUser() user: AuthenticatedUser,
      @Param('id', ParseIntPipe) id: number,
      @Body() body: UpdateCompanyDto,
    ) {
      return this.companiesService.update(id, body, user);
    }
  
    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.companiesService.remove(id);
    }
  }