import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {User} from '../../shared/models/entities/user/user';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UpdateUserDto} from '../../shared/models/entities/user/dto/update-user-dto';
import {CreateUserDto} from '../../shared/models/entities/user/dto/create-user-dto';

@Injectable()
export class UserService extends GenericService<User, CreateUserDto, UpdateUserDto> {
	constructor(
			@InjectRepository(User)
			public readonly repository: Repository<User>,
			@InjectRepository(User)
			public readonly userRepository: Repository<User>
	) {
		super(repository, userRepository);
	}
}
