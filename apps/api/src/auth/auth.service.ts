import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthenticatedUser } from './current-user.type';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(data: LoginDto) {
        const user = await this.usersService.findByEmail(data.email);

        if(!user) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.passwordHash,
        );

        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        }

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }

    async me(currentUser: AuthenticatedUser) {
        const user = await this.usersService.findPublicById(currentUser.id);

        if(!user) {
            throw new NotFoundException('User not found.');
        }

        return user;
    }
}