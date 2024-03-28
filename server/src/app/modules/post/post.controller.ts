import {Controller} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {Post} from '../../shared/models/entities/post';
import {PostService} from './post.service';

@Controller('post')
export class PostController
    extends GenericController<
        Post,
        PostService
    > {
  
  constructor(service: PostService) {
    super(service);
  }
}
