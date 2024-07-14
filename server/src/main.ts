import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {
	INestApplication,
	ValidationPipe
} from '@nestjs/common';
import {
	DocumentBuilder,
	OpenAPIObject,
	SwaggerModule
} from '@nestjs/swagger';
import {HEADER} from './core/cors/headers';
import {ConfigService} from '@nestjs/config';

async function bootstrap(): Promise<ConfigService> {
	const app: INestApplication = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({whitelist: true}));
	app.enableCors({
		origin: '*',
		optionsSuccessStatus: 204,
		allowedHeaders: Object.values(HEADER)
	});
	
	const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
			.setTitle('API WebBicho')
			.setDescription('Rotas disponíveis para a API WebBicho.')
			.setVersion('1.0')
			.addSecurity('Token JWT', {
				type: 'apiKey',
				name: 'auth',
				in: 'header',
				description: 'Seu Token JWT gerado no login',
			})
			.build();
	const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document, {
		jsonDocumentUrl: 'swagger/json'
	});
	
	const env: ConfigService = app.get(ConfigService);
	const PORT: number = env.get<number>('PORT');
	await app.listen(PORT);
	return env;
}

bootstrap().then((env: ConfigService): void => {
	const PORT: number = env.get<number>('PORT');
	const HOST: string = env.get<string>('HOST');
	const locale: string = Intl.DateTimeFormat().resolvedOptions().locale || 'default';
	console.log(locale);
	console.log(`>>> Servidor NestJS rodando em ${HOST} na porta ${PORT} <<<`);
});
