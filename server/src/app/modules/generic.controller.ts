import {Body, Delete, Get, Headers, HttpException, HttpStatus, Param, Patch, Post, Put} from '@nestjs/common';
import {GenericEntity} from '../shared/models/entities/generic-entity';
import {Page} from '../shared/models/classes/page';
import {GenericService} from './generic.service';
import {DeepPartial, FindOptionsOrder} from 'typeorm';
import {WhereParam} from '../shared/models/types/where-param';

export const HEADER_USER_ID: string = 'user-id';
export const HEADER_FIELDS: string = 'fields';
export const HEADER_RELATIONS: string = 'relations';
export const HEADER_PARAMS: string = 'params';
export const HEADER_ORDER: string = 'order';
export const PAGE_NUMBER: string = 'page';
export const PAGE_SIZE: string = 'size';

export abstract class GenericController<
    T extends GenericEntity,
    S extends GenericService<T>
> {
  protected constructor(
      private readonly service: S,
  ) {
  }
  
  @Get(':id?')
  public async findOne(
      @Param('id') id?: string,
      @Headers(HEADER_FIELDS) fields?: string[],
      @Headers(HEADER_RELATIONS) relations?: string[],
      @Headers(HEADER_PARAMS) params?: WhereParam<T>[],
  ): Promise<T> {
    try {
      return this.service.findOne(
          id,
          fields,
          relations,
          params,
      );
    } catch (e: any) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(
          `Erro ao buscar ${this.service.entityName} ${id}: ${e.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Get(':page/:size')
  public async list(
      @Param(PAGE_NUMBER) page: number = 1,
      @Param(PAGE_SIZE) size: number = 9,
      @Headers(HEADER_FIELDS) fields?: string[],
      @Headers(HEADER_RELATIONS) relations?: string[],
      @Headers(HEADER_PARAMS) params?: WhereParam<T>[],
      @Headers(HEADER_ORDER) order?: FindOptionsOrder<T>,
  ): Promise<Page<T>> {
    try {
      return this.service.list(
          page,
          size,
          fields,
          relations,
          params,
          order,
      );
    } catch (e: any) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(
          `Erro ao buscar lista de ${this.service.entityName}: ${e.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Post()
  public async create(
      @Body() entity: DeepPartial<T>,
      @Headers(HEADER_USER_ID) userId: string,
  ): Promise<T> {
    try {
      return this.service.create(entity, userId);
    } catch (e: any) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(
          `Erro ao criar ${this.service.entityName}: ${e.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Put()
  public async update(
      @Body() entity: DeepPartial<T>,
      @Headers(HEADER_USER_ID) userId: string,
  ): Promise<T> {
    try {
      return this.service.update(entity, userId);
    } catch (e: any) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(
          `Erro ao atualizar ${this.service.entityName}: ${e.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Delete(':id?')
  public async delete(
      @Headers(HEADER_PARAMS) params: WhereParam<T>[],
      @Param('id?') id: string,
  ): Promise<void> {
    try {
      await this.service.delete(params, id);
    } catch (e: any) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(
          `Erro ao deletar ${this.service.entityName}: ${e.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Patch()
  public async patch(
      @Body() entity: DeepPartial<T>,
      @Headers(HEADER_USER_ID) userId: string,
      @Headers(HEADER_PARAMS) params: WhereParam<T>[],
  ) {
    try {
      await this.service.patch(
          entity,
          userId,
          params,
      );
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(
          `Erro ao atualizar ${this.service.entityName}: ${e.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
