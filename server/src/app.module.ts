import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './app/core/database/database.module';
import {GenericModule} from './app/modules/generic/generic.module';

@Module({
	imports: [
		DatabaseModule,
		GenericModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
