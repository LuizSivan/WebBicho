import {Body, Controller, Get, Header, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {TokenService} from '../../shared/services/token.service';
import {DeepPartial} from 'typeorm';
import { User } from 'src/app/shared/models/entities/user';
import {CheckJwtGuardGuard} from './check-jwt-guard.guard';
import {HEADER_TOKEN} from './auth.module';
import {HEADER_PARAMS} from '../../modules/generic/generic.controller';

@Controller('auth')
export class AuthController {
	constructor(
			private readonly authService: AuthService,
			private readonly tokenService: TokenService,
	) {
	}
	
	@Post('login')
	async login(
			@Body('username') username: string,
			@Body('password') password: string,
	) {
		return this.authService.login(username, password);
	}
	
	@Post('register')
	async register(@Body() entity: DeepPartial<User>) {
		return this.authService.register(entity);
	}
	
	@Patch('verify')
	async verify(@Param('token') token: string) {
		// Lógica para verificar a conta
		return this.authService.verifyAccount(token);
	}
	
	@UseGuards(CheckJwtGuardGuard)
	@Get()
	async authenticateToken(@Header(HEADER_TOKEN) token: string): Promise<object> {
		return this.tokenService.authenticateToken(token);
	}
}
