import {
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	Post,
	Query,
	Render,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {TokenService} from '../../shared/services/token.service';
import {User} from 'src/shared/models/entities/user/user';
import {AuthGuard} from '../../core/guards/auth.guard';
import {
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiHeader,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiQuery,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {UserRegisterDto} from '../../shared/models/entities/user/dto/user-register-dto';
import {UserLoginDto} from '../../shared/models/entities/user/dto/user-login-dto';
import {HEADER} from '../../core/cors/headers';
import {ConfigService} from '@nestjs/config';
import {EnvKey} from '../../core/env-key.enum';

@Controller('auth')
@ApiTags('Autenticação', 'Authentication')
export class AuthController {
	constructor(
			private readonly authService: AuthService,
			private readonly tokenService: TokenService,
			private readonly env: ConfigService,
	) {
	}
	
	@Post('login')
	@HttpCode(200)
	@ApiOperation({summary: 'Realiza o login de um usuário existente'})
	@ApiOkResponse({description: 'Usuário logado com sucesso'})
	@ApiUnauthorizedResponse({description: 'Login e/ou senha inválidos'})
	@ApiForbiddenResponse({description: 'Usuário não verificado'})
	@ApiNotFoundResponse({description: 'Usuário não encontrado'})
	public async login(@Body() userInput: UserLoginDto): Promise<User> {
		try {
			return this.authService.login(userInput.login, userInput.password);
		} catch (e) {
			throw e;
		}
	}
	
	@Post('register')
	@ApiOperation({summary: 'Realiza o registro de um novo usuário'})
	@ApiCreatedResponse({description: 'Usuário registrado com sucesso'})
	@ApiConflictResponse({description: 'Usuário e/ou e-mail já está em uso'})
	public async register(@Body() entity: UserRegisterDto): Promise<User> {
		try {
			return this.authService.register(entity);
		} catch (e) {
			throw e;
		}
	}
	
	@Get('verify')
	@Render('verification')
	@ApiOperation({summary: 'Verifica a conta de um usuário'})
	@ApiQuery({name: 'token', description: 'Token de verificação'})
	@ApiOkResponse({description: 'Conta verificada com sucesso'})
	@ApiConflictResponse({description: 'Usuário já verificado ou não encontrado'})
	public async verifyAccount(
			@Query('token') token: string,
	): Promise<object> {
		const frontendURL: string = this.env.get<string>(EnvKey.APP_FRONTEND_URL);
		try {
			const newToken: string = await this.authService.verifyAccount(token);
			return {
				title: 'Conta Verificada',
				message: 'Conta verificada com sucesso!',
				buttonText: 'Ir para o site',
				buttonUrl: `frontendURL?token=${newToken}`,
				isError: false,
			};
		} catch (e) {
			return {
				title: 'Erro na Verificação',
				message: 'Não foi possível verificar a conta!',
				buttonText: 'Ir para o site',
				buttonUrl: frontendURL,
				isError: true, // Indica erro para o estilo dinâmico
			};
		}
	}
	
	@Get()
	@UseGuards(AuthGuard)
	@ApiOperation({summary: 'Autentica o token de um usuário'})
	@ApiHeader({name: HEADER.AUTHORIZATION, description: 'Token de autenticação'})
	@ApiOkResponse({description: 'Token autenticado com sucesso'})
	@ApiUnauthorizedResponse({description: 'Access denied'})
	public async authenticateToken(
			@Headers(HEADER.AUTHORIZATION) token: string,
	): Promise<object> {
		try {
			return this.tokenService.authenticateToken(token);
		} catch (e) {
			console.error(`Erro ao decodificar o token: ${e.message}`);
			throw new UnauthorizedException(`Access denied`);
		}
	}
}
