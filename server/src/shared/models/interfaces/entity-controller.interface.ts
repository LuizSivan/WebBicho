import {GenericEntity} from '../entities/generic-entity';
import {WhereParam} from '../types/where-param';
import {
	DeepPartial,
	FindOptionsOrder
} from 'typeorm';
import {Page} from '../classes/page';

export interface EntityController<T extends GenericEntity> {
	findOne(
		id?: number,
		fields?: string[],
		relations?: string[],
		params?: WhereParam<T>[],
	): Promise<T>;
	
	list(
		page: number,
		size: number,
		fields?: string[],
		relations?: string[],
		params?: WhereParam<T>[],
		order?: FindOptionsOrder<T>,
	): Promise<Page<T>>;
	
	create(
		entity: T,
		userId: number,
	): Promise<T>;
	
	update(
		id: number,
		userId: number,
		entity: T,
	): Promise<T>;
	
	bulkUpdate(
		entity: DeepPartial<T>,
		userId: number,
		params: WhereParam<T>[],
	): Promise<void>;
	
	delete(
		id: number,
		userId: number,
	): Promise<void>;
	
	bulkDelete(
		userId: number,
		params: WhereParam<T>[],
	): Promise<void>;
}
