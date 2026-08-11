import { Body, Controller, Get, Post} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Post()
    create(
        @Body()
        body: {
            email: string;
            passwordHash: string;
            role?: 'ADMIN' | 'USER';
        },
    ) {
        return this.userService.create(body);
    }
}