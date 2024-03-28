import {Module} from '@nestjs/common';
import {CommentService} from './comment.service';
import {CommentController} from './comment.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Comment} from '../../shared/models/entities/comment';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {
}
