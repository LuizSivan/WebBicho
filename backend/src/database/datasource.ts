import { DataSource, DataSourceOptions, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import path from 'node:path';

export const DEFAULT_DB: string = 'webbicho';

const __dirEntity: string = path.join(__dirname, '..');
const OPTIONS: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DBHOST || 'localhost',
	port: Number(process.env.DBPORT || 5432),
	username: process.env.DBUSER || 'postgres',
	password: process.env.DBPASSWORD || 'LT03122020',
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
