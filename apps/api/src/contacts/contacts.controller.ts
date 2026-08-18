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
  import { ContactsService } from './contacts.service';
  import { CreateContactDto } from './dto/create-contact.dto';
  import { UpdateContactDto } from './dto/update-contact.dto';
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('contacts')
  export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}
  
    @Get()
    findAll(
      @CurrentUser() user: AuthenticatedUser,
      @Query('q') q?: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
      @Query('ownerId') ownerId?: string,
      @Query('companyId') companyId?: string,
    ) {
      return this.contactsService.findAll({
        q,
        page,
        limit,
        ownerId: ownerId ? Number(ownerId) : undefined,
        companyId: companyId ? Number(companyId) : undefined,
        currentUser: user,
      });
    }
  
    @Get(':id')
    findOne(
      @CurrentUser() user: AuthenticatedUser,
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.contactsService.findOne(id, user);
    }
  
    @Post()
    create(
      @CurrentUser() user: AuthenticatedUser,
      @Body() body: CreateContactDto,
    ) {
      return this.contactsService.create({
        ...body,
        ownedById: user.role === Role.ADMIN && body.ownedById ? body.ownedById : user.id,
      });
    }
  
    @Patch(':id')
    update(
      @CurrentUser() user: AuthenticatedUser,
      @Param('id', ParseIntPipe) id: number,
      @Body() body: UpdateContactDto,
    ) {
      return this.contactsService.update(id, body, user);
    }
  
    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.contactsService.remove(id);
    }
  }