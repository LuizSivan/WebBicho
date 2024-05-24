import {Controller, UseGuards} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {Post} from '../../shared/models/entities/post/post';
import {PostService} from './post.service';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';
import {ApiTags} from '@nestjs/swagger';

@Controller('post')
@ApiTags('Posts', 'Postagens')
@UseGuards(CheckJwtGuard)
export class PostController
  extends GenericController<
    Post,
    PostService
  > {
  
  constructor(service: PostService) {
    super(service);
  }
}
