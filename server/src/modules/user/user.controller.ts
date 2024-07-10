import {
	Controller,
	MethodNotAllowedException,
	Post,
	UseGuards
} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {User} from '../../shared/models/entities/user/user';
import {UserService} from './user.service';
import {
	ApiExcludeEndpoint,
	ApiTags
} from '@nestjs/swagger';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';
import {UpdateUserDto} from '../../shared/models/entities/user/dto/update-user-dto';
import {CreateUserDto} from '../../shared/models/entities/user/dto/create-user-dto';

@Controller('user')
@ApiTags('Usuários')
@UseGuards(CheckJwtGuard)
export class UserController
	extends GenericController<
		User,
		UserService,
		CreateUserDto,
		UpdateUserDto
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
