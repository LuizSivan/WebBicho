import {Module} from '@nestjs/common';
import {PostService} from './post.service';
import {PostController} from './post.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Post} from '../../shared/models/entities/post/post';
import {User} from '../../shared/models/entities/user/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User]),
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {
}
