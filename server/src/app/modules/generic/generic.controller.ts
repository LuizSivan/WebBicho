import {Get, Headers, HttpException, HttpStatus, Query} from '@nestjs/common';
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
	): Promise<Page<T> | HttpException> {
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
	
	@Get('get-by-id')
	public async findById(
			@Query('id') id: string,
	): Promise<T | HttpException> {
		try {
			return this.service.findById(id);
		} catch (e: any) {
			throw new HttpException(
					e.message ?? 'Internal Server Error',
					HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
