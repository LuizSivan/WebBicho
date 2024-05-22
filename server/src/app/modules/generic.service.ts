import {
  BadRequestException, ForbiddenException, Injectable, NotFoundException,
} from '@nestjs/common';
import {GenericEntity} from '../shared/models/entities/generic-entity';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity';
import {Page} from '../shared/models/classes/page';
import {convertParam, convertParams} from '../shared/helpers/convert-helper';
import {WhereParam} from '../shared/models/types/where-param';
import {EUserRole, User} from '../shared/models/entities/user/user';

@Injectable()
export abstract class GenericService<T extends GenericEntity> {
  public readonly entityName: string;
  
  protected constructor(
      public readonly repository: Repository<T>,
      public readonly userRepository: Repository<User>,
  ) {
    this.entityName = this.repository.metadata.name;
  }
  
  /**
   * Busca uma única entidade do tipo T no repositório.
   * @param {number} entityId (opcional) uuid da entidade.
   * @param {string[]} fields (opcional) campos a serem buscados na consulta.
   * @param {string[]} relations (opcional) relações a serem carregadas na consulta.
   * @param {WhereParam[]} params (opcional) parâmetros de busca da consulta.
   * @returns {Promise} - a entidade encontrada.
   * @throws BadRequestException se nenhum parâmetro for informado.
   * */
  public async findOne(
      entityId?: string,
      fields?: string[],
      relations?: string[],
      params?: WhereParam<T>[],
  ): Promise<T> {
    if (!params && !entityId) {
      throw new BadRequestException(
          'Nenhum parâmetro informado'
      );
    }
    const where: FindOptionsWhere<T>[] = params
      ? convertParams(params).map(p => ({
        ...p, id: entityId
      }))
      : undefined;
    const options: FindOneOptions = {
      select: fields,
      relations: relations,
      where: where,
    };
    return await this.repository.findOne(options);
  }
  
  /**
   * Busca uma lista de entidades do tipo T no repositório.
   * @param {number} page número da página.
   * @param {number} size número de itens a serem carregados
   * @param {string[]} fields (opcional) campos a serem buscados na consulta
   * @param {string[]} relations (opcional) relações a serem carregadas na consulta
   * @param {WhereParam} params (opcional) parâmetros de busca da consulta
   * @param {string[]} order (opcional) ordem de resultado da consulta
   * @returns {Page} a página de entidades encontradas
   * */
  public async list(
      page: number,
      size: number,
      fields?: string[],
      relations?: string[],
      params?: WhereParam<T>[],
      order?: FindOptionsOrder<T>
  ): Promise<Page<T>> {
    const options: FindManyOptions = {
      select: fields,
      relations: relations,
      where: params ? convertParam(params) : undefined,
      skip: (page - 1) * size,
      take: size,
      order: order,
    };
    const [data, count]: [T[], number] = await this.repository.findAndCount(options);
    return new Page(
        data,
        page,
        Math.ceil(count / size),
        count
    );
  }
  
  public async create(
      entity: DeepPartial<T>,
      userId: string,
  ): Promise<T> {
    entity.createdBy = userId;
    entity.updatedBy = userId;
    const queryRunner: QueryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await this.repository.insert(
          entity as QueryDeepPartialEntity<T>
      );
      await queryRunner.commitTransaction();
      return await this.repository.findOneByOrFail(
          {id: entity.id} as FindOptionsWhere<T>
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
  
  public async update(
      entityId: string,
      entity: DeepPartial<T>,
      userId: string,
  ): Promise<T> {
    const queryRunner: QueryRunner = this.repository.manager.connection.createQueryRunner();
    const exists: boolean = await this.repository.existsBy(
        {
          id: entityId,
        } as FindOptionsWhere<T>
    );
    if (!exists) {
      throw new NotFoundException(
          `${this.repository.metadata.name} ${entityId} não encontrado!`,
      );
    }
    await queryRunner.startTransaction();
    try {
      entity.updatedBy = userId;
      await this.repository.update(
          {id: entity.id} as FindOptionsWhere<T>,
          entity as QueryDeepPartialEntity<T>,
      );
      await queryRunner.commitTransaction();
      return await this.repository.findOneByOrFail(
          {id: entityId} as FindOptionsWhere<T>
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
  
  public async patch(
      entity: DeepPartial<T>,
      userId: string,
      params: WhereParam<T>[],
  ): Promise<void> {
    const convertedParams: FindOptionsWhere<T>[] = convertParams(
        params
    );
    entity.updatedBy = userId;
    const queryRunner: QueryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      for (const where of convertedParams) {
        await this.repository.update(
            where, entity as QueryDeepPartialEntity<T>
        );
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
  
  public async delete(
      entityId: string
  ): Promise<void> {
    const exists: boolean = await this.repository.existsBy(
        {id: entityId} as FindOptionsWhere<T>
    );
    if (!exists) {
      throw new NotFoundException(
          `${this.repository.metadata.name} ${entityId} não encontrado!`,
      );
    }
    const queryRunner: QueryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await this.repository.softDelete(
          {
            id: entityId
          } as FindOptionsWhere<T>
      );
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
  
  public async bulkDelete(
      params: WhereParam<T>[]
  ): Promise<void> {
    const convertedParams: FindOptionsWhere<T>[] = convertParams(
        params
    );
    const exists: boolean = await this.repository.existsBy(
        convertedParams
    );
    if (!exists) {
      throw new NotFoundException(
          `Nenhum ${this.repository.metadata.name} encontrado(a)!`,
      );
    }
    const queryRunner: QueryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      for (const where of convertedParams) {
        await this.repository.softDelete(
            where
        );
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
  
  abstract beforeCreate(_entity: DeepPartial<T>): Promise<void>;
  
  async beforeUpdate(
      entityId: string,
      _entity: DeepPartial<T>,
      userId: string,
  ): Promise<void> {
    const user: User = await this.userRepository.findOneOrFail(
        {
          select: ['id', 'role'],
          where: {
            id: userId
          },
        }
    );
    const entity: T = await this.repository.findOne(
        {
          select: ['id', 'createdBy'],
          where: {id: entityId} as FindOptionsWhere<T>,
        }
    );
    if (user.id != entity.createdBy || user.role != EUserRole.STAFF) {
      throw new ForbiddenException(
          'Acesso negado'
      );
    }
  }
  
  async beforeBulkUpdate(
      _entity: DeepPartial<T>,
      userId: string,
  ): Promise<void> {
    const user: User = await this.userRepository.findOneOrFail(
        {
          select: ['id'],
          where: {
            id: userId
          },
        }
    );
    if (user.id != _entity.createdBy)
      throw new ForbiddenException(
          'Acesso negado'
      );
  }
  
  async beforeDelete(
      entityId: string, userId: string
  ): Promise<void> {
    const user: User = await this.userRepository.findOneOrFail(
        {
          select: ['id'],
          where: {
            id: userId
          },
        }
    );
    const entity: T = await this.repository.findOneOrFail(
        {
          select: ['id', 'createdBy'],
          where: [{
            id: entityId
          }] as FindOptionsWhere<T>[],
        }
    );
    if (user.id != entity.createdBy)
      throw new ForbiddenException(
          'Acesso negado'
      );
  }
  
  async beforeBulkDelete(
      params: WhereParam<T>[],
      userId: string,
  ): Promise<void> {
    if (!params?.length)
      throw new BadRequestException(
          'Nenhum parâmetro fornecido'
      );
    const user: User = await this.userRepository.findOneOrFail(
        {
          select: ['id', 'role'],
          where: {
            id: userId
          },
        }
    );
    if (user.role != EUserRole.STAFF) {
      for (const param of params) {
        param.createdBy = user.id;
      }
    }
  }
}
