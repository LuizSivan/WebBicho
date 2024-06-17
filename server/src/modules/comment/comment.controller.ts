import {
  Controller,
  UseGuards
} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {Comment} from '../../shared/models/entities/comment/comment';
import {CommentService} from './comment.service';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';
import {ApiTags} from '@nestjs/swagger';
import {CreateCommentDto} from '../../shared/models/entities/comment/dto/create-comment-dto';
import {UpdateCommentDto} from '../../shared/models/entities/comment/dto/update-comment-dto';

@Controller('comment')
@ApiTags('Comentários')
@UseGuards(CheckJwtGuard)
export class CommentController
  extends GenericController<
    Comment,
    CommentService,
    CreateCommentDto,
    UpdateCommentDto
  > {
  constructor(service: CommentService) {
    super(service);
  }
}
