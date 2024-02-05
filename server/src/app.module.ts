import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './app/core/database/database.module';
import {AuthModule} from './app/core/auth/auth.module';

@Module({
	imports: [
		DatabaseModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
