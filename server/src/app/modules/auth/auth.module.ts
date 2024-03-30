import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user/user';
import process from 'process';
import {MailService} from '../../shared/services/mail.service';
import {TokenService} from '../../shared/services/token.service';

export const SECRET: string = process.env.JWT_SECRET as string;
export const HEADER_USER: string = 'user';
export const HEADER_TOKEN: string = 'auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    TokenService,
  ],
})
export class AuthModule {
}
