import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user/user';
import {MailService} from '../../shared/services/mail.service';
import {TokenService} from '../../shared/services/token.service';


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
