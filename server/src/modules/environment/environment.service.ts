import {
	Injectable,
	Logger,
	OnApplicationBootstrap
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import VaultClient, {Lease} from 'node-vault-client';
import {VaultConfig} from '../../shared/models/classes/vault-config';

@Injectable()
export class EnvironmentService implements OnApplicationBootstrap {
	
	private readonly vaultClient: VaultClient;
	private readonly logger: Logger;
	
	constructor(
			readonly env: ConfigService
	) {
		this.logger = new Logger(EnvironmentService.name);
		const VAULT_URL: string = env.get<string>('VAULT_URL');
		const VAULT_TOKEN: string = env.get<string>('VAULT_TOKEN');
		this.vaultClient = VaultClient.boot('main', {
			api: {url: VAULT_URL},
			auth: {
				type: 'token',
				config: {
					token: VAULT_TOKEN
				}
			}
		});
	}
	
	async onApplicationBootstrap(): Promise<void> {
		try {
			const lease: Lease = await this.vaultClient.read('webbicho/server');
			VaultConfig.factory(lease.getData());
		} catch (e) {
			this.logger.error(`Error while reading from Vault: ${e.message}`);
		}
	}
}
