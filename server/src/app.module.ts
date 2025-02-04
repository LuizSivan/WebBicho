import {Module} from '@nestjs/common';
import {DatabaseModule} from './core/database/database.module';
import {AuthModule} from './routes/auth/auth.module';
import {PostModule} from './routes/post/post.module';
import {CommentModule} from './routes/comment/comment.module';
import {UserModule} from './routes/user/user.module';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {EnvironmentModule} from './modules/environment/environment.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		EnvironmentModule,
		DatabaseModule,
		AuthModule,
		PostModule,
		CommentModule,
		UserModule,
	],
	controllers: [AppController],
})
export class AppModule {
}
