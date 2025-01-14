import {
	Injectable,
	Logger
} from '@nestjs/common';
import {
	Client,
	ClientConfig,
	QueryResult
} from 'pg';
import {ConfigService} from '@nestjs/config';
import {
	TypeOrmModuleOptions,
	TypeOrmOptionsFactory
} from '@nestjs/typeorm';
import {TypeORMLogger} from './typeorm-logger';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
	private readonly clientConfig: ClientConfig;
	private readonly client: Client;
	private readonly defaultDb: string;
	private readonly logger: Logger;
	
	
	constructor(
			private readonly env: ConfigService,
	) {
		this.logger = new Logger(this.constructor.name);
		this.clientConfig = {
			host: this.env.get<string>('DB_HOST'),
			port: this.env.get<number>('DB_PORT'),
			user: this.env.get<string>('DB_USER'),
			password: this.env.get<string>('DB_PASSWORD'),
		};
		this.client = new Client({
			...this.clientConfig,
			database: 'postgres',
		});
		this.defaultDb = this.env.get<string>('DEFAULT_DB', 'webbicho');
	}
	
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		try {
			await this.client.connect();
			const databaseExists: boolean = await this.checkDatabaseExists();
			if (!databaseExists) {
				await this.createDatabase();
				await this.createUnaccentExtension();
			}
			const logging: boolean = this.env.get<string>('DB_LOGGING') === 'true';
			return {
				type: 'postgres',
				host: this.env.get<string>('DB_HOST'),
				port: this.env.get<number>('DB_PORT'),
				username: this.env.get<string>('DB_USER'),
				password: this.env.get<string>('DB_PASSWORD'),
				database: this.defaultDb,
				entities: [`${__dirname}/../../shared/models/entities/**/*.{js,ts}`],
				migrations: [`${__dirname}/../../shared/models/migrations/**/*.ts`],
				synchronize: this.env.get<string>('NODE_ENV') !== 'production',
				logger: new TypeORMLogger({logging: logging ? true : ['error']}),
				namingStrategy: new SnakeNamingStrategy(),
			};
		} catch (e: any) {
			this.logger.error(`Erro na verificação do banco de dados: ${e.message}`);
		}
	}
	
	private async checkDatabaseExists(): Promise<boolean> {
		const res: QueryResult = await this.client.query(
				`SELECT datname
         FROM pg_catalog.pg_database
         WHERE lower(datname) = lower('${this.defaultDb}')`,
		);
		return res.rows.length > 0;
	}
	
	private async createDatabase(): Promise<void> {
		try {
			await this.client.query(`CREATE DATABASE ${this.defaultDb}`);
		} catch (e: any) {
			this.logger.error(`Erro ao criar banco de dados '${this.defaultDb}': ${e.message}`);
		} finally {
			void this.client.end();
		}
	}
	
	private async createUnaccentExtension(): Promise<void> {
		const newClient: Client = new Client({
			...this.clientConfig,
			database: this.defaultDb,
		});
		try {
			await newClient.connect();
			await newClient.query('CREATE EXTENSION IF NOT EXISTS unaccent');
		} catch (e: any) {
			this.logger.error(`Erro ao criar EXTENSION unaccent: ${e.message}`);
		} finally {
			void newClient.end();
		}
	}
}
