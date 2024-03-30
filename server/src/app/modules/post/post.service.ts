import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {Post} from '../../shared/models/entities/post/post';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user/user';

@Injectable()
export class PostService extends GenericService<Post> {
  constructor(
      @InjectRepository(Post)
      public readonly repository: Repository<Post>,
      @InjectRepository(User)
      public readonly userRepository: Repository<User>,
  ) {
    super(repository, userRepository);
  }
}
