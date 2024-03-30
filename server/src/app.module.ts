import {Module} from '@nestjs/common';
import {DatabaseModule} from './app/core/database/database.module';
import {AuthModule} from './app/modules/auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './app/shared/models/entities/user';
import {PostModule} from './app/modules/post/post.module';
import {CommentModule} from './app/modules/comment/comment.module';
import {UserModule} from './app/modules/user/user.module';

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
