import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {INestApplication} from '@nestjs/common';
import {createDatabaseIfNotExist} from './app/core/database/maintenance';
import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();
const PORT: string | number = process.env.PORT || 8070;

async function bootstrap(): Promise<void> {
	await createDatabaseIfNotExist();
	const app: INestApplication = await NestFactory.create(AppModule);
	await app.listen(PORT);
}

bootstrap().then((): void => {
	console.log(`Servidor NestJS rodando na porta ${PORT}`);
});
