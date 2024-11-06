import {GenericEntity} from '../entities/generic-entity';
import {WhereParam} from '../types/where-param';
import {DeepPartial, FindOptionsOrder} from 'typeorm';
import {Page} from '../classes/page';

export interface EntityController<T extends GenericEntity> {
	findOne(
		id?: string,
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
		userId: string,
	): Promise<T>;
  
	update(
		id: string,
		userId: string,
		entity: T,
	): Promise<T>;
  
	bulkUpdate(
		entity: DeepPartial<T>,
		userId: string,
		params: WhereParam<T>[],
	): Promise<void>;
  
	delete(
		id: string,
		userId: string,
	): Promise<void>;
  
	bulkDelete(
		userId: string,
		params: WhereParam<T>[],
	): Promise<void>;
}
