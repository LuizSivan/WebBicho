import {Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {TokenService} from '../../shared/services/token.service';
import {DeepPartial} from 'typeorm';
import {User} from 'src/app/shared/models/entities/user';
import {CheckJwtGuardGuard} from './check-jwt-guard.guard';
import {HEADER_TOKEN} from './auth.module';

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
    try {
      return this.authService.login(username, password);
    } catch (e) {
      throw e;
    }
  }
  
  @Post('register')
  public async register(@Body() entity: DeepPartial<User>): Promise<User> {
    try {
      return this.authService.register(entity);
    } catch (e) {
      throw e;
    }
  }
  
  @Patch('verify')
  public async verify(@Param('token') token: string): Promise<User> {
    try {
      return this.authService.verifyAccount(token);
    } catch (e) {
      throw e;
    }
  }
  
  @UseGuards(CheckJwtGuardGuard)
  @Get()
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
