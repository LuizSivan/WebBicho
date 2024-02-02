import {Get, Headers, HttpException, HttpStatus, Param, Query} from '@nestjs/common';
import {GenericEntity} from '../../shared/models/entities/generic-entity';
import {Page} from '../../shared/models/classes/page';
import {GenericService} from '../../shared/services/generic.service';
import {FindOptionsOrder} from 'typeorm';

export class GenericController<T extends GenericEntity> {
	
	constructor(
			private readonly service: GenericService<T>
	) {
	}
	
	@Get('list')
	public async list(
			@Headers('fields') fields: string[],
			@Headers('relations') relations: string[],
			@Headers('params') params: any[],
			@Headers('order') order: FindOptionsOrder<T>,
			@Query('page') page: number = 1,
			@Query('size') size: number = 9,
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
					e.message ?? 'Internal Server Error',
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
					e.message ?? 'Internal Server Error',
					HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
