import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {Post} from '../../shared/models/entities/post';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class PostService extends GenericService<Post> {
  
  constructor(
      @InjectRepository(Post)
      public readonly repository: Repository<Post>,
  ) {
    super(repository);
  }
  
}
