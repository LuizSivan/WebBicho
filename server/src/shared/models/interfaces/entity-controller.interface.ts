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
      userUuid: string,
  ): Promise<T>;
  
  update(
      id: string,
      userUuid: string,
      entity: T,
  ): Promise<T>;
  
  bulkUpdate(
      entity: DeepPartial<T>,
      userUuid: string,
      params: WhereParam<T>[],
  ): Promise<void>;
  
  delete(
      id: string,
      userUuid: string,
  ): Promise<void>;
  
  bulkDelete(
      userUuid: string,
      params: WhereParam<T>[],
  ): Promise<void>;
}
