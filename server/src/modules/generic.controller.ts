import {
	Body,
	Delete,
	Get,
	Headers,
	HttpException,
	InternalServerErrorException,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import {GenericEntity} from '../shared/models/entities/generic-entity';
import {Page} from '../shared/models/classes/page';
import {GenericService} from './generic.service';
import {
	DeepPartial,
	FindOptionsOrder
} from 'typeorm';
import {WhereParam} from '../shared/models/types/where-param';
import {CheckJwtGuard} from '../core/guards/check-jwt.guard';
import {
	ApiHeader,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiParam
} from '@nestjs/swagger';
import {HEADER} from '../core/cors/headers';
import {PATH} from '../core/cors/paths';
import {
	ApiFindOneDecorators,
	ApiListDecorators
} from '../shared/helpers/api-swagger-helper';


@UseGuards(CheckJwtGuard)
export abstract class GenericController<
	T extends GenericEntity,
	S extends GenericService<T, CT, UT>,
	CT extends GenericEntity,
	UT extends GenericEntity,
> {
	protected constructor(
			private readonly service: S,
	) {
	}
	
	@Get(':id?')
	@ApiFindOneDecorators()
	public async findOne(
			@Param('id', ParseIntPipe) id?: number,
			@Headers(HEADER.FIELDS) fields?: string[],
			@Headers(HEADER.RELATIONS) relations?: string[],
			@Headers(HEADER.PARAMS) params?: WhereParam<T>[],
	): Promise<T> {
		try {
			return this.service.findOne(id, fields, relations, params);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao buscar ${this.service.entityName} ${id}: ${e.message}`
			);
		}
	}
	
	@Get('page/:page/size/:size')
	@ApiListDecorators()
	public async list(
			@Param(PATH.PAGE, ParseIntPipe) page: number = 1,
			@Param(PATH.SIZE, ParseIntPipe) size: number = 9,
			@Headers(HEADER.FIELDS) fields?: string[],
			@Headers(HEADER.RELATIONS) relations?: string[],
			@Headers(HEADER.PARAMS) params?: WhereParam<T>[],
			@Headers(HEADER.ORDER) order?: FindOptionsOrder<T>,
	): Promise<Page<T>> {
		try {
			return this.service.list(page, size, fields, relations, params, order);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao buscar lista de ${this.service.entityName}: ${e.message}`,
			);
		}
	}
	
	@Post()
	@ApiOperation({summary: 'Cria uma entidade'})
	@ApiHeader({name: HEADER.USER_ID, description: 'Id do usuário'})
	@ApiInternalServerErrorResponse({description: 'Erro ao criar entidade'})
	public async create(
			@Body() entity: CT,
			@Headers(HEADER.USER_ID) userId: number
	): Promise<T> {
		try {
			return this.service.create(entity, userId);
		} catch (e: any) {
			throw new InternalServerErrorException(
					`Erro ao criar ${this.service.entityName}: ${e.message}`
			);
		}
	}
	
	@Put(':id')
	@ApiOperation({summary: 'Atualiza uma entidade via id'})
	@ApiParam({name: 'id', description: 'Id da entidade'})
	@ApiHeader({name: HEADER.USER_ID, description: 'Id do usuário'})
	public async update(
			@Param('id', ParseIntPipe) id: number,
			@Headers(HEADER.USER_ID) userId: number,
			@Body() entity: UT,
	): Promise<T> {
		try {
			return this.service.update(id, entity, userId);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao atualizar ${this.service.entityName}: ${e.message}`
			);
		}
	}
	
	@Put('bulk')
	@ApiOperation({summary: 'Atualiza várias entidades via parâmetros'})
	@ApiHeader({name: HEADER.USER_ID, description: 'Id do usuário'})
	@ApiHeader({name: HEADER.PARAMS, description: 'Parâmetros da busca'})
	public async bulkUpdate(
			@Body() entity: DeepPartial<T>,
			@Headers(HEADER.USER_ID) userId: number,
			@Headers(HEADER.PARAMS) params: WhereParam<T>[],
	): Promise<void> {
		try {
			await this.service.bulkUpdate(entity, userId, params);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao atualizar ${this.service.entityName}: ${e.message}`
			);
		}
	}
	
	@Delete(':id')
	@ApiOperation({summary: 'Deleta uma entidade via id'})
	@ApiParam({name: 'id', description: 'Id da entidade'})
	@ApiHeader({name: HEADER.USER_ID, description: 'Id do usuário'})
	public async delete(
			@Param('id', ParseIntPipe) id: number,
			@Headers(HEADER.USER_ID) userId: number,
	): Promise<void> {
		try {
			await this.service.delete(id, userId);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao deletar ${this.service.entityName}: ${e.message}`
			);
		}
	}
	
	@Delete('bulk')
	@ApiOperation({summary: 'Deleta várias entidades via parâmetros'})
	@ApiHeader({name: HEADER.USER_ID, description: 'Id do usuário'})
	@ApiHeader({name: HEADER.PARAMS, description: 'Parâmetros da busca'})
	public async bulkDelete(
			@Headers(HEADER.USER_ID) userId: number,
			@Headers(HEADER.PARAMS) params: WhereParam<T>[],
	): Promise<void> {
		try {
			await this.service.bulkDelete(params, userId);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao deletar ${this.service.entityName}: ${e.message}`
			);
		}
	}
}
