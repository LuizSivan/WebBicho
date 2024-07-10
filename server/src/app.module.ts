import {Module} from '@nestjs/common';
import {DatabaseModule} from './core/database/database.module';
import {AuthModule} from './modules/auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './shared/models/entities/user/user';
import {PostModule} from './modules/post/post.module';
import {CommentModule} from './modules/comment/comment.module';
import {UserModule} from './modules/user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		DatabaseModule,
		AuthModule,
		PostModule,
		CommentModule,
		UserModule,
	],
})
export class AppModule {
}
