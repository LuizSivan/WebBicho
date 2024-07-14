import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
	ConfigModule,
	ConfigService
} from '@nestjs/config';
import {DatabaseService} from './database.service';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useClass: DatabaseService
		})
	],
})
export class DatabaseModule {
}
