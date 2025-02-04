import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
	ConfigModule,
	ConfigService
} from '@nestjs/config';
import {DatabaseService} from './database.service';
import {EnvironmentModule} from '../../modules/environment/environment.module';
import {EnvironmentService} from '../../modules/environment/environment.service';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule, EnvironmentModule],
			inject: [ConfigService, EnvironmentService],
			useClass: DatabaseService
		})
	],
})
export class DatabaseModule {
}
