import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {User} from '../../shared/models/entities/user/user';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
      @InjectRepository(User)
      public readonly repository: Repository<User>,
      @InjectRepository(User)
      public readonly userRepository: Repository<User>,
  ) {
    super(repository, userRepository);
  }
  
  async beforeUpdate(entityId: string, _entity: DeepPartial<User>, userId: string): Promise<void> {
    delete _entity.role;
    delete _entity.verified;
    delete _entity.password;
    await super.beforeUpdate(entityId, _entity, userId);
  }
}
