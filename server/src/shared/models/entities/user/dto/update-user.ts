import {OmitType} from '@nestjs/swagger';
import {User} from '../user';

export class UpdateUser
  extends OmitType(User, [
    'role',
    'verified',
    'password',
    'email',
  ]) {
}
