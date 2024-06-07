import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {TokenService} from '../../shared/services/token.service';
import {User} from 'src/shared/models/entities/user/user';
import {HEADER_TOKEN} from './auth.module';
import {AuthGuard} from '../../core/guards/auth.guard';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import {UserRegisterDto} from '../../shared/models/entities/user/dto/user-register-dto';

@Controller('auth')
@ApiTags('Autenticação')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly tokenService: TokenService,
  ) {
  }
  
  @Post('login')
  @ApiOperation({summary: 'Realiza o login de um usuário existente'})
  public async login(
      @Body('username') username: string,
      @Body('password') password: string,
  ): Promise<User> {
    try {
      return this.authService.login(username, password);
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
  
  @Patch('verify')
  @ApiOperation({summary: 'Verifica a conta de um usuário'})
  public async verify(@Param('token') token: string): Promise<User> {
    try {
      return this.authService.verifyAccount(token);
    } catch (e) {
      throw e;
    }
  }
  
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({summary: 'Autentica o token de um usuário'})
  public async authenticateToken(
      @Headers(HEADER_TOKEN) token: string,
  ): Promise<object> {
    try {
      return this.tokenService.authenticateToken(token);
    } catch (e) {
      console.error(`Erro ao decodificar o token: ${e.message}`);
      throw new HttpException(
          `Acesso negado.`,
          HttpStatus.FORBIDDEN,
      );
    }
  }
}
