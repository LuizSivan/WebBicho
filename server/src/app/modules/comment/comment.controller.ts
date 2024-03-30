import {Controller, UseGuards} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {Comment} from '../../shared/models/entities/comment/comment';
import {CommentService} from './comment.service';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';
import {ApiTags} from '@nestjs/swagger';

@Controller('comment')
@ApiTags('Comment', 'Comentário')
@UseGuards(CheckJwtGuard)
export class CommentController
    extends GenericController<
        Comment,
        CommentService
    > {
  constructor(service: CommentService) {
    super(service);
  }
}
