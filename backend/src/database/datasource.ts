import { DataSource, DataSourceOptions } from 'typeorm';

require('dotenv').config();

const DEFAULT_DB: string = 'webbicho';

const OPTIONS: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DBHOST || 'localhost',
	port: Number(process.env.DBPORT || 5432),
	username: process.env.DBUSER || 'postgres',
	password: process.env.DBPASSWORD || 'LT03122020',
	database: DEFAULT_DB,
	entities: [__dirname + '/../models/entities/*.{js,ts}'],
	synchronize: true,
	logging: Boolean(process.env.LOG) ?? true,
};

export const appDataSource: DataSource = new DataSource(OPTIONS);

