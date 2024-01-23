import {DataSource, DataSourceOptions, EntityTarget, ObjectLiteral, Repository} from 'typeorm';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

export const DEFAULT_DB: string = 'webbicho';

const __dirEntity: string = path.join(__dirname, '..');
const OPTIONS: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: DEFAULT_DB,
	entities: [__dirEntity + '/models/entities/**/*.{js,ts}'],
	synchronize: true,
	logging: true,
};

export const appDataSource: DataSource = new DataSource(OPTIONS);
export const Maintenance: DataSource = new DataSource({
	...OPTIONS,
	database: 'postgres',
	entities: []
});

const connections: Map<String, DataSource> = new Map();

export function getDataSource(tenant: string): DataSource {
	if (connections.has(tenant)) {
		return connections.get(tenant) as DataSource;
	} else {
		return appDataSource;
	}
}

export function getRepository<T extends ObjectLiteral>(
		target: EntityTarget<T>,
		tenant: string = DEFAULT_DB
): Repository<T> {
	try {
		return getDataSource(tenant).getRepository(target);
	} catch (e) {
		return appDataSource.getRepository(target);
	}
}
