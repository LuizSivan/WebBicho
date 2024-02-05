import {Body, Controller, Get, Header, Headers, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {TokenService} from '../../shared/services/token.service';
import {DeepPartial} from 'typeorm';
import { User } from 'src/app/shared/models/entities/user';
import {CheckJwtGuardGuard} from './check-jwt-guard.guard';
import {HEADER_TOKEN} from './auth.module';
import {HEADER_FIELDS, HEADER_PARAMS} from '../../modules/generic/generic.controller';

@Controller('auth')
export class AuthController {
	constructor(
			private readonly authService: AuthService,
			private readonly tokenService: TokenService,
	) {
	}
	
	@Post('login')
	public async login(
			@Body('username') username: string,
			@Body('password') password: string,
	): Promise<User> {
		return this.authService.login(username, password);
	}
	
	@Post('register')
	public async register(@Body() entity: DeepPartial<User>): Promise<User> {
		return this.authService.register(entity);
	}
	
	@Patch('verify')
	public async verify(@Param('token') token: string): Promise<User> {
		return this.authService.verifyAccount(token);
	}
	
	@UseGuards(CheckJwtGuardGuard)
	@Get()
	public async authenticateToken(
			@Headers(HEADER_TOKEN) token: string
	): Promise<object> {
		return this.tokenService.authenticateToken(token);
	}
}
