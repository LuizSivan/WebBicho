import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {Comment} from '../../shared/models/entities/comment';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user';

@Injectable()
export class CommentService extends GenericService<Comment> {
  constructor(
      @InjectRepository(Comment)
      public readonly repository: Repository<Comment>,
      @InjectRepository(User)
      public readonly userRepository: Repository<User>,
  ) {
    super(repository, userRepository);
  }
}
