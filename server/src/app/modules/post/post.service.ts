import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {Post} from '../../shared/models/entities/post';
import {Repository} from 'typeorm';

@Injectable()
export class PostService extends GenericService<Post> {
  
  constructor(repository: Repository<Post>) {
    super(repository);
  }
  
}
