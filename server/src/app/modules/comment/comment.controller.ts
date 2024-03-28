import {Controller} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {Comment} from '../../shared/models/entities/comment';
import {CommentService} from './comment.service';

@Controller('comment')
export class CommentController
    extends GenericController<
        Comment,
        CommentService
    > {
  constructor(service: CommentService) {
    super(service);
  }
}
