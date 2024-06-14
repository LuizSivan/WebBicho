import {
  Body,
  Delete,
  Get,
  Headers,
  HttpException,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {GenericEntity} from '../shared/models/entities/generic-entity';
import {Page} from '../shared/models/classes/page';
import {GenericService} from './generic.service';
import {DeepPartial, FindOptionsOrder} from 'typeorm';
import {WhereParam} from '../shared/models/types/where-param';
import {CheckJwtGuard} from '../core/guards/check-jwt.guard';
import {
  ApiHeader, ApiInternalServerErrorResponse, ApiOperation, ApiParam
} from '@nestjs/swagger';

export const HEADER_USER_ID: string = 'user-id';
export const HEADER_FIELDS: string = 'fields';
export const HEADER_RELATIONS: string = 'relations';
export const HEADER_PARAMS: string = 'params';
export const HEADER_ORDER: string = 'order';
export const PAGE_NUMBER: string = 'page';
export const PAGE_SIZE: string = 'size';

@UseGuards(CheckJwtGuard)
export abstract class GenericController<
  T extends GenericEntity,
  S extends GenericService<T>
> {
  protected constructor(
      private readonly service: S,
  ) {
  }
  
  @Get(':id?')
  @ApiOperation({summary: 'Retorna uma entidade via parâmetros'})
  @ApiParam({name: 'id', required: false, description: 'Id da entidade'})
  @ApiHeader({name: HEADER_FIELDS, required: false, description: 'Campos da entidade a serem buscados'})
  @ApiHeader({name: HEADER_RELATIONS, required: false, description: 'Relações a serem carregadas'})
  @ApiHeader({name: HEADER_PARAMS, required: false, description: 'Parâmetros da busca'})
  @ApiInternalServerErrorResponse({description: 'Erro ao buscar entidade'})
  public async findOne(
      @Param('id', ParseUUIDPipe) id?: string,
      @Headers(HEADER_FIELDS) fields?: string[],
      @Headers(HEADER_RELATIONS) relations?: string[],
      @Headers(HEADER_PARAMS) params?: WhereParam<T>[],
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
  
  @Get(':page/:size')
  @ApiOperation({summary: 'Lista as entidade via parâmetros'})
  @ApiParam({name: 'page', description: 'Número da página'})
  @ApiParam({name: 'size', description: 'Tamanho da página'})
  @ApiHeader({name: HEADER_FIELDS, required: false, description: 'Campos da entidade a sem buscados'})
  @ApiHeader({name: HEADER_RELATIONS, required: false, description: 'Relações a serem carregadas'})
  @ApiHeader({name: HEADER_PARAMS, required: false, description: 'Parâmetros da busca'})
  @ApiHeader({name: HEADER_ORDER, required: false, description: 'Ordem da busca'})
  @ApiInternalServerErrorResponse({description: 'Erro ao buscar lista de entidades'})
  public async list(
      @Param(PAGE_NUMBER, ParseIntPipe) page: number = 1,
      @Param(PAGE_SIZE, ParseIntPipe) size: number = 9,
      @Headers(HEADER_FIELDS) fields?: string[],
      @Headers(HEADER_RELATIONS) relations?: string[],
      @Headers(HEADER_PARAMS) params?: WhereParam<T>[],
      @Headers(HEADER_ORDER) order?: FindOptionsOrder<T>,
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
  @ApiHeader({name: HEADER_USER_ID, description: 'Id do usuário'})
  @ApiInternalServerErrorResponse({description: 'Erro ao criar entidade'})
  public async create(
      @Body() entity: DeepPartial<T>,
      @Headers(HEADER_USER_ID) userId: string
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
  @ApiHeader({name: HEADER_USER_ID, description: 'Id do usuário'})
  public async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Headers(HEADER_USER_ID) userId: string,
      @Body() entity: DeepPartial<T>,
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
  @ApiHeader({name: HEADER_USER_ID, description: 'Id do usuário'})
  @ApiHeader({name: HEADER_PARAMS, description: 'Parâmetros da busca'})
  public async bulkUpdate(
      @Body() entity: DeepPartial<T>,
      @Headers(HEADER_USER_ID) userId: string,
      @Headers(HEADER_PARAMS) params: WhereParam<T>[],
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
  @ApiHeader({name: HEADER_USER_ID, description: 'Id do usuário'})
  public async delete(
      @Param('id', ParseUUIDPipe) id: string,
      @Headers(HEADER_USER_ID) userId: string,
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
  @ApiHeader({name: HEADER_USER_ID, description: 'Id do usuário'})
  @ApiHeader({name: HEADER_PARAMS, description: 'Parâmetros da busca'})
  public async bulkDelete(
      @Headers(HEADER_USER_ID) userId: string,
      @Headers(HEADER_PARAMS) params: WhereParam<T>[],
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
