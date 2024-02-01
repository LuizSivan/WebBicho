import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {INestApplication} from '@nestjs/common';
import {createDatabaseIfNotExist} from './app/core/database/maintenance';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap(): Promise<void> {
	await createDatabaseIfNotExist();
	const app: INestApplication = await NestFactory.create(AppModule);
	await app.listen(8070);
}

bootstrap().then((): void => {
	console.log(`Servidor NestJS rodando na porta 8070`);
});
