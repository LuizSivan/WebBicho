import {
	Body, Controller, Headers, Param, ParseIntPipe, UseGuards
} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {Comment} from '../../shared/models/entities/comment/comment';
import {CommentService} from './comment.service';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';
import {ApiTags} from '@nestjs/swagger';
import {
	ApiBulkDeleteOperation,
	ApiBulkUpdateOperation,
	ApiCreateOperation,
	ApiDeleteOperation,
	ApiFindOneOperation,
	ApiListOperation,
	ApiUpdateOperation
} from '../../shared/helpers/api-swagger-helper';
import {HEADER} from '../../core/cors/headers';
import {WhereParam} from '../../shared/models/types/where-param';
import {PATH} from '../../core/cors/paths';
import {DeepPartial, FindOptionsOrder} from 'typeorm';
import {Page} from '../../shared/models/classes/page';
import {CreateCommentDto} from '../../shared/models/entities/Comment/dto/create-Comment-dto';
import {UpdateCommentDto} from '../../shared/models/entities/Comment/dto/update-Comment-dto';
import {EntityController} from '../../shared/models/interfaces/entity-controller.interface';

@Controller('comment')
@UseGuards(CheckJwtGuard)
@ApiTags('Comentários')
export class CommentController
	extends GenericController<
		Comment,
		CommentService,
		CreateCommentDto,
		UpdateCommentDto
	> implements EntityController<Comment> {
  
	constructor(service: CommentService) {
		super(service);
	}
  
	@ApiFindOneOperation()
	public async findOne(
      @Param('id', ParseIntPipe) id?: number,
      @Headers(HEADER.FIELDS) fields?: string[],
      @Headers(HEADER.RELATIONS) relations?: string[],
      @Headers(HEADER.PARAMS) params?: WhereParam<Comment>[]
	): Promise<Comment> {
		return super.findOne(id, fields, relations, params);
	}
  
	@ApiListOperation()
	public async list(
      @Param(PATH.PAGE, ParseIntPipe) page: number = 1,
      @Param(PATH.SIZE, ParseIntPipe) size: number = 9,
      @Headers(HEADER.FIELDS) fields?: string[],
      @Headers(HEADER.RELATIONS) relations?: string[],
      @Headers(HEADER.PARAMS) params?: WhereParam<Comment>[],
      @Headers(HEADER.ORDER) order?: FindOptionsOrder<Comment>,
	): Promise<Page<Comment>> {
		return super.list(page, size, fields, relations, params, order);
	}
  
	@ApiCreateOperation()
	public async create(
      @Body() entity: CreateCommentDto,
      @Headers(HEADER.USER_ID) userId: number
	): Promise<Comment> {
		return super.create(entity, userId);
	}
  
	@ApiUpdateOperation()
	public async update(
      @Param('id', ParseIntPipe) id: number,
      @Headers(HEADER.USER_ID) userId: number,
      @Body() entity: UpdateCommentDto
	): Promise<Comment> {
		return super.update(id, userId, entity);
	}
  
	@ApiBulkUpdateOperation()
	public async bulkUpdate(
			entity: DeepPartial<Comment>,
			userId: number,
			params: WhereParam<Comment>[]
	): Promise<void> {
		return super.bulkUpdate(entity, userId, params);
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
      @Headers(HEADER.PARAMS) params: WhereParam<Comment>[],
	): Promise<void> {
		return super.bulkDelete(userId, params);
	}
}
