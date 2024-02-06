import {Module} from '@nestjs/common';
import {DatabaseModule} from './app/core/database/database.module';
import {AuthModule} from './app/core/auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './app/shared/models/entities/user';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		DatabaseModule,
		AuthModule,
	]
})
export class AppModule {
}
