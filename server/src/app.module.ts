import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './app/core/database/database.module';
import {AuthModule} from './app/core/auth/auth.module';
import { ServicesService } from './mail/app/shared/services.service';
import { MailService } from './app/shared/services/mail.service';
import { TokenService } from './app/shared/services/token.service';

@Module({
	imports: [
		DatabaseModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService, ServicesService, MailService, TokenService],
})
export class AppModule {
}
