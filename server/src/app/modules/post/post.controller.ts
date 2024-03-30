import {Controller, UseGuards} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {Post} from '../../shared/models/entities/post';
import {PostService} from './post.service';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';

@Controller('post')
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
