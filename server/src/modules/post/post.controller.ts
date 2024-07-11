import {
	Body,
	Controller,
	Headers,
	Param,
	ParseIntPipe,
	UseGuards
} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {Post} from '../../shared/models/entities/post/post';
import {PostService} from './post.service';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';
import {
	ApiHeader,
	ApiTags
} from '@nestjs/swagger';
import {WhereParam} from '../../shared/models/types/where-param';
import {
	ApiBulkDeleteOperation,
	ApiCreateOperation,
	ApiDeleteOperation,
	ApiFindOneOperation,
	ApiListOperation,
	ApiUpdateOperation
} from '../../shared/helpers/api-swagger-helper';
import {HEADER} from '../../core/cors/headers';
import {FindOptionsOrder} from 'typeorm';
import {Page} from '../../shared/models/classes/page';
import {PATH} from '../../core/cors/paths';
import {CreatePostDto} from '../../shared/models/entities/post/dto/create-post-dto';
import {UpdatePostDto} from '../../shared/models/entities/post/dto/update-post-dto';

@Controller('post')
@UseGuards(CheckJwtGuard)
@ApiTags('Postagens')
@ApiHeader({name: 'auth', description: 'Token de Autorização'})
export class PostController
	extends GenericController<
		Post,
		PostService,
		CreatePostDto,
		UpdatePostDto
	> {
	
	constructor(service: PostService) {
		super(service);
	}
	
	@ApiFindOneOperation()
	public async findOne(
			@Param('id', ParseIntPipe) id?: number,
			@Headers(HEADER.FIELDS) fields?: string[],
			@Headers(HEADER.RELATIONS) relations?: string[],
			@Headers(HEADER.PARAMS) params?: WhereParam<Post>[]
	): Promise<Post> {
		return super.findOne(id, fields, relations, params);
	}
	
	@ApiListOperation()
	public async list(
			@Param(PATH.PAGE, ParseIntPipe) page: number = 1,
			@Param(PATH.SIZE, ParseIntPipe) size: number = 9,
			@Headers(HEADER.FIELDS) fields?: string[],
			@Headers(HEADER.RELATIONS) relations?: string[],
			@Headers(HEADER.PARAMS) params?: WhereParam<Post>[],
			@Headers(HEADER.ORDER) order?: FindOptionsOrder<Post>,
	): Promise<Page<Post>> {
		return super.list(page, size, fields, relations, params, order);
	}
	
	@ApiCreateOperation()
	public async create(
			@Body() entity: CreatePostDto,
			@Headers(HEADER.USER_ID) userId: number
	): Promise<Post> {
		return super.create(entity, userId);
	}
	
	@ApiUpdateOperation()
	public async update(
			@Param('id', ParseIntPipe) id: number,
			@Headers(HEADER.USER_ID) userId: number,
			@Body() entity: UpdatePostDto
	): Promise<Post> {
		return super.update(id, userId, entity);
	}
	
	@ApiDeleteOperation()
	public async delete(
			@Param('id', ParseIntPipe) id: number,
			@Headers(HEADER.USER_ID) userId: number,
	): Promise<void> {
		return super.delete(id, userId);
	}
	
	@ApiBulkDeleteOperation()
	async bulkDelete(
			@Headers(HEADER.USER_ID) userId: number,
			@Headers(HEADER.PARAMS) params: WhereParam<Post>[],
	): Promise<void> {
		return super.bulkDelete(userId, params);
	}
}
