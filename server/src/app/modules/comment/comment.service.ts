import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {Comment} from '../../shared/models/entities/comment';
import {Repository} from 'typeorm';

@Injectable()
export class CommentService extends GenericService<Comment> {
  constructor(repository: Repository<Comment>) {
    super(repository);
  }
}
