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
import {NestExpressApplication} from '@nestjs/platform-express';
import {pathAssets} from './assets/path-assets';
import {VaultConfig} from './shared/models/classes/vault-config';

async function bootstrap(): Promise<void> {
	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);
	
	app.useGlobalPipes(new ValidationPipe({whitelist: true}));
	app.enableCors({
		origin: '*',
		optionsSuccessStatus: 204,
		allowedHeaders: Object.values(HEADER),
	});
	
	app.setBaseViewsDir(pathAssets.views);
	app.setViewEngine('hbs');
	app.useStaticAssets(pathAssets.logos, {prefix: '/images/'});
	
	const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
			.setTitle('WebBicho API')
			.setDescription('Available routes for the WebBicho API')
			.setVersion('1.0')
			.addSecurity('JWT Token', {
				type: 'apiKey',
				name: HEADER.AUTHORIZATION,
				in: 'header',
				description: 'Your JWT token generated at the login route',
			})
			.build();
	const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document, {
		jsonDocumentUrl: 'swagger/json',
	});
	
	await app.listen(VaultConfig.APP.PORT);
}

bootstrap().then((): void => {
	new Logger('NestApplication')
			.log(`NestJS server running at ${VaultConfig.APP.PORT}`);
});
