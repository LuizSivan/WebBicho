import {Controller} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {User} from '../../shared/models/entities/user';
import {UserService} from './user.service';

@Controller('user')
export class UserController
    extends GenericController<
        User,
        UserService
    > {
  
  constructor(service: UserService) {
    super(service);
  }
}
