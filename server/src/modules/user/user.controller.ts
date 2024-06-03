import {
  Controller, MethodNotAllowedException, Post, UseGuards
} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {User} from '../../shared/models/entities/user/user';
import {UserService} from './user.service';
import {ApiExcludeEndpoint, ApiTags} from '@nestjs/swagger';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';

@Controller('user')
@ApiTags('Usuários')
@UseGuards(CheckJwtGuard)
export class UserController
  extends GenericController<
    User,
    UserService
  > {
  
  constructor(service: UserService) {
    super(service);
  }
  
  @Post()
  @ApiExcludeEndpoint()
  override async create(): Promise<User> {
    throw new MethodNotAllowedException();
  }
  
  
}
