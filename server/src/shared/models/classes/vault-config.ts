import {LogLevel} from 'typeorm';

interface VaultAppEnvironment {
	readonly FRONTEND_URL: string;
	readonly HOST: string;
	readonly PORT: number;
	readonly JWT_SECRET: string;
}

interface VaultDatabaseEnvironment {
	readonly DEFAULT: string;
	readonly HOST: string;
	readonly LOGGING: boolean | LogLevel[];
	readonly PASSWORD: string;
	readonly PORT: number;
	readonly USER: string;
}

interface VaultEmailEnvironment {
	readonly USER: string;
	readonly PASSWORD: string;
	readonly SMTP: string;
}

export class VaultConfig {
	static APP: VaultAppEnvironment;
	static DATABASE: VaultDatabaseEnvironment;
	static MAIL: VaultEmailEnvironment;
	
	static factory(data: Record<string, unknown>): void {
		VaultConfig.APP = {
			FRONTEND_URL: String(data.APP_FRONTEND_URL),
			HOST: String(data.APP_HOST),
			PORT: Number(data.APP_PORT),
			JWT_SECRET: String(data.JWT_SECRET),
		};
		
		VaultConfig.DATABASE = {
			DEFAULT: String(data.DB_DEFAULT) ?? 'webbicho',
			HOST: String(data.DB_HOST),
			LOGGING: data.DB_LOGGING as boolean | LogLevel[],
			PASSWORD: String(data.DB_PASSWORD),
			PORT: Number(data.DB_PORT),
			USER: String(data.DB_USER),
		};
		
		VaultConfig.MAIL = {
			USER: String(data.EMAIL),
			PASSWORD: String(data.PASSWORD),
			SMTP: String(data.SMTP),
		};
	}
}
