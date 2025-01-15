import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {
	Logger,
	ValidationPipe
} from '@nestjs/common';
import {
	DocumentBuilder,
	OpenAPIObject,
	SwaggerModule
} from '@nestjs/swagger';
import {HEADER} from './core/cors/headers';
import {ConfigService} from '@nestjs/config';
import {NestExpressApplication} from '@nestjs/platform-express';
import {EnvKey} from './core/env-key.enum';
import {pathAssets} from './assets/path-assets';

async function bootstrap(): Promise<ConfigService> {
	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);
	app.useGlobalPipes(new ValidationPipe({whitelist: true}));
	app.enableCors({
		origin: '*',
		optionsSuccessStatus: 204,
		allowedHeaders: Object.values(HEADER),
	});
	
	app.setBaseViewsDir(pathAssets.views);
	app.setViewEngine('hbs');
	app.useStaticAssets(pathAssets.logos, {prefix: '/logos/'});
	
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
		jsonDocumentUrl: 'swagger/json',
	});
	
	const env: ConfigService = app.get(ConfigService);
	const PORT: number = env.get<number>(EnvKey.APP_PORT);
	await app.listen(PORT);
	return env;
}

bootstrap().then((env: ConfigService): void => {
	const PORT: number = env.get<number>(EnvKey.APP_PORT);
	const HOST: string = env.get<string>(EnvKey.APP_HOST);
	new Logger('NestApplication')
			.log(`NestJS server running at ${HOST}`);
});
