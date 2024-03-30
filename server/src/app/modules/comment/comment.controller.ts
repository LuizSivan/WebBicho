import {Controller, UseGuards} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {Comment} from '../../shared/models/entities/comment';
import {CommentService} from './comment.service';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';

@Controller('comment')
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
