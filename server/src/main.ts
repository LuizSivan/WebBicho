import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import {
	DocumentBuilder, OpenAPIObject, SwaggerModule
} from '@nestjs/swagger';
import {HEADER} from './core/cors/headers';
import {ConfigService} from '@nestjs/config';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';

async function bootstrap(): Promise<ConfigService> {
	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);
	app.useGlobalPipes(new ValidationPipe({whitelist: true}));
	app.enableCors({
		origin: '*',
		optionsSuccessStatus: 204,
		allowedHeaders: Object.values(HEADER)
	});
  
	app.setBaseViewsDir(join(__dirname, '..', 'views'));
	app.setViewEngine('hbs');
  
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
	new Logger('NestApplication')
			.log(`Servidor NestJS rodando em ${HOST} na porta ${PORT}`);
});
