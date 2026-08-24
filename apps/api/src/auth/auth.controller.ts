import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { AuthenticatedUser } from './current-user.type';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@CurrentUser() user: AuthenticatedUser) {
        return this.authService.me(user);
    }
}