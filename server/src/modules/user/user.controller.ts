import {
	Body,
	Controller,
	Headers,
	MethodNotAllowedException,
	Param,
	ParseIntPipe,
	ParseUUIDPipe,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {UserService} from './user.service';
import {
	ApiExcludeEndpoint,
	ApiTags
} from '@nestjs/swagger';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';
import {UpdateUserDto} from '../../shared/models/entities/user/dto/update-user-dto';
import {CreateUserDto} from '../../shared/models/entities/user/dto/create-user-dto';
import {EntityController} from '../../shared/models/interfaces/entity-controller.interface';
import {
	ApiBulkDeleteOperation,
	ApiDeleteOperation,
	ApiFindOneOperation,
	ApiListOperation,
	ApiUpdateOperation,
} from '../../shared/helpers/api-swagger-helper';
import {HEADER} from '../../core/cors/headers';
import {WhereParam} from '../../shared/models/types/where-param';
import {PATH} from '../../core/cors/paths';
import {FindOptionsOrder} from 'typeorm';
import {Page} from '../../shared/models/classes/page';
import {User} from '../../shared/models/entities/user/user';
import {PARAM} from '../../core/cors/params';

@Controller('user')
@UseGuards(CheckJwtGuard)
@ApiTags('Usuários')
export class UserController
	extends GenericController<
		User,
		UserService,
		CreateUserDto,
		UpdateUserDto
	> implements EntityController<User> {
	
	constructor(service: UserService) {
		super(service);
	}
	
	@ApiFindOneOperation()
	public async findOne(
			@Param(PARAM.UUID, ParseUUIDPipe) uuid?: string,
			@Headers(HEADER.FIELDS) fields?: string[],
			@Headers(HEADER.RELATIONS) relations?: string[],
			@Headers(HEADER.PARAMS) params?: WhereParam<User>[],
	): Promise<User> {
		return super.findOne(uuid, fields, relations, params);
	}
	
	@ApiListOperation()
	public async list(
			@Param(PATH.PAGE, ParseIntPipe) page: number = 1,
			@Param(PATH.SIZE, ParseIntPipe) size: number = 9,
			@Headers(HEADER.FIELDS) fields?: string[],
			@Headers(HEADER.RELATIONS) relations?: string[],
			@Headers(HEADER.PARAMS) params?: WhereParam<User>[],
			@Headers(HEADER.ORDER) order?: FindOptionsOrder<User>,
	): Promise<Page<User>> {
		return super.list(page, size, fields, relations, params, order);
	}
	
	@Post()
	@ApiExcludeEndpoint()
	override async create(): Promise<User> {
		throw new MethodNotAllowedException();
	}
	
	@Put('bulk')
	@ApiExcludeEndpoint()
	public async bulkUpdate(): Promise<void> {
		throw new MethodNotAllowedException();
	}
	
	@ApiUpdateOperation()
	public async update(
			@Param(PARAM.UUID, ParseUUIDPipe) uuid: string,
			@Headers(HEADER.USER_ID) userUuid: string,
			@Body() entity: UpdateUserDto,
	): Promise<User> {
		return super.update(uuid, userUuid, entity);
	}
	
	@ApiDeleteOperation()
	public async delete(
			@Param(PARAM.UUID, ParseUUIDPipe) uuid: string,
			@Headers(HEADER.USER_ID) userUuid: string,
	): Promise<void> {
		return super.delete(uuid, userUuid);
	}
	
	@ApiBulkDeleteOperation()
	async bulkDelete(
			@Headers(HEADER.USER_ID) userUuid: string,
			@Headers(HEADER.PARAMS) params: WhereParam<User>[],
	): Promise<void> {
		return super.bulkDelete(userUuid, params);
	}
}
