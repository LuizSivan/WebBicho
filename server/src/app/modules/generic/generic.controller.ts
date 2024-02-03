import {Body, Delete, Get, Headers, HttpException, HttpStatus, Param, Post, Put} from '@nestjs/common';
import {GenericEntity} from '../../shared/models/entities/generic-entity';
import {Page} from '../../shared/models/classes/page';
import {GenericService} from '../../shared/services/generic.service';
import {DeepPartial, FindOptionsOrder} from 'typeorm';

export const HEADER_USER_ID: string = 'user-id';

export class GenericController<T extends GenericEntity> {
	
	constructor(
			private readonly service: GenericService<T>
	) {
	}
	
	@Get(':page/:size')
	public async list(
			@Headers('fields') fields: string[],
			@Headers('relations') relations: string[],
			@Headers('params') params: any[],
			@Headers('order') order: FindOptionsOrder<T>,
			@Param('page') page: number = 1,
			@Param('size') size: number = 9,
	): Promise<Page<T>> {
		try {
			return this.service.list(
					page,
					size,
					fields,
					relations,
					params,
					order
			);
		} catch (e: any) {
			throw new HttpException(
					`Erro ao buscar lista de ${this.service.entityName}: ${e.message}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
	
	@Get(':id?')
	public async findOne(
			@Headers('fields') fields: string[],
			@Headers('relations') relations: string[],
			@Headers('params') params: any[],
			@Param('id') id?: string,
	): Promise<T> {
		try {
			return this.service.findOne(
					fields,
					relations,
					params,
					id
			);
		} catch (e: any) {
			throw new HttpException(
					`Erro ao buscar ${this.service.entityName} ${id}: ${e.message}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
	
	@Post()
	public async create(
			@Body() entity: DeepPartial<T>,
			@Headers(HEADER_USER_ID) userId: string
	): Promise<T> {
		try {
			return this.service.create(entity, userId);
		} catch (e: any) {
			throw new HttpException(
					`Erro ao criar ${this.service.entityName}: ${e.message}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
	
	@Put(':id')
	public async update(
			@Body() entity: DeepPartial<T>,
			@Headers(HEADER_USER_ID) userId: string
	): Promise<T> {
		try {
			return this.service.update(entity, userId);
		} catch (e: any) {
			throw new HttpException(
					`Erro ao atualizar ${this.service.entityName} ${entity.id}: ${e.message}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
	
	@Delete(':id')
	public async delete(
			@Param('id') id: string,
	): Promise<void> {
		try {
			await this.service.delete(id);
		} catch (e: any) {
			throw new HttpException(
					`Erro ao deletar ${this.service.entityName} ${id}: ${e.message}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
