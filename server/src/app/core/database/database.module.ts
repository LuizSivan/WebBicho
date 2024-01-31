import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import dotenv from 'dotenv';
import {DataSourceOptions} from 'typeorm';
import {DatabaseService} from './database.service';

dotenv.config();

export const DEFAULT_DB: string = 'webbicho';
const OPTIONS: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: DEFAULT_DB,
	entities: [__dirname + '/models/entities/**/*.{js,ts}'],
	synchronize: true,
	logging: true,
};

@Global()
@Module({
	imports: [
		TypeOrmModule.forRoot(OPTIONS)
	],
	providers: [DatabaseService]
})
export class DatabaseModule {
}
