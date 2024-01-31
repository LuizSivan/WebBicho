import {Injectable, Scope} from '@nestjs/common';
import {DataSource, EntityTarget, ObjectLiteral, Repository} from 'typeorm';
import {DEFAULT_DB} from './database.module';

@Injectable({scope: Scope.DEFAULT})
export class DatabaseService {
	private readonly connections: Map<string, DataSource> = new Map();
	
	constructor(
			private readonly appDataSource: DataSource,
	) {
	}
	
	getRepository<T extends ObjectLiteral>(
			target: EntityTarget<T>,
			tenant: string = DEFAULT_DB,
	): Repository<T> {
		try {
			return this.getDataSource(tenant).getRepository(target);
		} catch (e) {
			return this.appDataSource.getRepository(target);
		}
	}
	
	private getDataSource(tenant: string): DataSource {
		if (this.connections.has(tenant)) {
			return this.connections.get(tenant) as DataSource;
		} else {
			return this.appDataSource;
		}
	}
}
