import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {Comment} from '../../shared/models/entities/comment/comment';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user/user';

@Injectable()
export class CommentService extends GenericService<Comment> {
  constructor(
      @InjectRepository(Comment)
      public readonly repository: Repository<Comment>,
      @InjectRepository(User)
      public readonly userRepository: Repository<User>
  ) {
    super(repository, userRepository);
  }
  
  beforeCreate(_entity: Comment): Promise<void> {
    return Promise.resolve();
  }
}
