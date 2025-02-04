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
import {EnvironmentService} from '../../modules/environment/environment.service';
import {VaultConfig} from '../../shared/models/classes/vault-config';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
	private clientConfig: ClientConfig;
	private client: Client;
	private defaultDb: string;
	private readonly logger: Logger;
	
	
	constructor(
			private readonly env: ConfigService,
			private readonly vault: EnvironmentService
	) {
		
		this.logger = new Logger(this.constructor.name);
		this.logger.debug('Construindo serviço');
		
	}
	
	async beforeCreateTypeOrmOptions(): Promise<void> {
		await this.vault.loadEnvironmentVariables();
		this.clientConfig = {
			host: VaultConfig.DATABASE?.HOST,
			port: VaultConfig.DATABASE?.PORT,
			user: VaultConfig.DATABASE?.USER,
			password: VaultConfig.DATABASE?.PASSWORD,
		};
		this.client = new Client({
			...this.clientConfig,
			database: 'postgres',
		});
		this.defaultDb = VaultConfig.DATABASE?.DEFAULT;
	}
	
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		await this.beforeCreateTypeOrmOptions();
		try {
			await this.client.connect();
			const databaseExists: boolean = await this.checkDatabaseExists();
			if (!databaseExists) {
				await this.createDatabase();
				await this.createUnaccentExtension();
			}
			return {
				type: 'postgres',
				host: VaultConfig.DATABASE.HOST,
				port: VaultConfig.DATABASE.PORT,
				username: VaultConfig.DATABASE.USER,
				password: VaultConfig.DATABASE.PASSWORD,
				database: this.defaultDb,
				entities: [`${__dirname}/../../shared/models/entities/**/*.{js,ts}`],
				migrations: [`${__dirname}/../../shared/models/migrations/**/*.ts`],
				synchronize: this.env.get<string>('NODE_ENV') !== 'production',
				logger: new TypeORMLogger({logging: VaultConfig.DATABASE.LOGGING}),
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
