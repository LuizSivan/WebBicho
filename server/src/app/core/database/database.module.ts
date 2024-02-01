import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DataSourceOptions} from 'typeorm';
import {DEFAULT_DB} from './maintenance';

const OPTIONS: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: DEFAULT_DB,
	entities: [`${__dirname}/../../shared/models/entities/**/*.{js,ts}`],
	migrations: [`${__dirname}/../../shared/models/migrations/**/*.ts`],
	synchronize: process.env.NODE_ENV !== 'production',
	logging: true,
	
};

@Module({
	imports: [TypeOrmModule.forRoot(OPTIONS)],
	providers: []
})
export class DatabaseModule {
}
