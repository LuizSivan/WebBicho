import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {Post} from '../../shared/models/entities/post/post';
import {
  DeepPartial, EntityManager, Repository
} from 'typeorm';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user/user';

@Injectable()
export class PostService extends GenericService<Post> {
  constructor(
      @InjectRepository(Post)
      public readonly repository: Repository<Post>,
      @InjectRepository(User)
      public readonly userRepository: Repository<User>,
      @InjectEntityManager()
      public readonly entityManager: EntityManager,
  ) {
    super(entityManager, repository, userRepository);
  }
  
  beforeCreate(_entity: DeepPartial<Post>): Promise<void> {
    return Promise.resolve();
  }
}
