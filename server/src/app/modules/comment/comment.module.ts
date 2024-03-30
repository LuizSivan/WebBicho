import {Module} from '@nestjs/common';
import {CommentService} from './comment.service';
import {CommentController} from './comment.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Comment} from '../../shared/models/entities/comment/comment';
import {User} from '../../shared/models/entities/user/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {
}
