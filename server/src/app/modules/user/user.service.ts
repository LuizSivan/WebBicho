import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {User} from '../../shared/models/entities/user/user';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
      @InjectRepository(User)
      public readonly repository: Repository<User>,
      @InjectRepository(User)
      public readonly userRepository: Repository<User>
  ) {
    super(repository, userRepository);
  }
}
