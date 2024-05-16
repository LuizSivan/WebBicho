import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {GenericEntity} from '../shared/models/entities/generic-entity';
import {DeepPartial, FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository} from 'typeorm';
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

  public async findOne(
      entityId?: string,
      fields?: string[],
      relations?: string[],
      params?: WhereParam<T>[],
  ): Promise<T> {
    if (!params && !entityId) {
      throw new BadRequestException('Nenhum parâmetro informado');
    }
    const where: FindOptionsWhere<T>[] = params ? convertParams(params).map(p => ({...p, id: entityId})) : undefined;
    const options: FindOneOptions = {
      select: fields,
      relations: relations,
      where: where,
    };
    return await this.repository.findOne(options);
  }

  public async list(
      page: number,
      size: number,
      fields?: string[],
      relations?: string[],
      params?: WhereParam<T>[],
      order?: FindOptionsOrder<T>,
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
    return new Page(data, page, Math.ceil(count / size), count);
  }

  public async create(entity: DeepPartial<T>, userId: string): Promise<T> {
    const exists: boolean = await this.repository.existsBy({id: entity?.id} as FindOptionsWhere<T>);
    if (exists) {
      throw new ConflictException(`${this.repository.metadata.name} ${entity?.id} já existe!`);
    }
    entity.createdBy = userId;
    entity.updatedBy = userId;
    await this.repository.insert(entity as QueryDeepPartialEntity<T>);
    return await this.repository.findOneByOrFail({id: entity.id} as FindOptionsWhere<T>);
  }

  public async update(entityId: string, entity: DeepPartial<T>, userId: string): Promise<T> {
    const exists: boolean = await this.repository.existsBy({id: entityId} as FindOptionsWhere<T>);
    if (!exists) {
      throw new NotFoundException(`${this.repository.metadata.name} ${entityId} não encontrado!`);
    }
    entity.updatedBy = userId;
    await this.repository.update({id: entity.id} as FindOptionsWhere<T>, entity as QueryDeepPartialEntity<T>);
    return await this.repository.findOneByOrFail({id: entityId} as FindOptionsWhere<T>);
  }

  public async patch(entity: DeepPartial<T>, userId: string, params: WhereParam<T>[]): Promise<void> {
    const convertedParams: FindOptionsWhere<T>[] = convertParams(params);
    entity.updatedBy = userId;
    for (const where of convertedParams) {
      await this.repository.update(where, entity as QueryDeepPartialEntity<T>);
    }
  }

  public async delete(entityId: string): Promise<void> {
    const exists: boolean = await this.repository.existsBy({id: entityId} as FindOptionsWhere<T>);
    if (!exists) {
      throw new NotFoundException(`${this.repository.metadata.name} ${entityId} não encontrado!`);
    }
    await this.repository.softDelete({id: entityId} as FindOptionsWhere<T>);
  }

  public async bulkDelete(params: WhereParam<T>[]): Promise<void> {
    const convertedParams: FindOptionsWhere<T>[] = convertParams(params);
    const exists: boolean = await this.repository.existsBy(convertedParams);
    if (!exists) {
      throw new NotFoundException(`Nenhum ${this.repository.metadata.name} encontrado(a)!`);
    }
    for (const where of convertedParams) {
      await this.repository.softDelete(where);
    }
  }

  abstract beforeCreate(_entity: DeepPartial<T>): Promise<void>;

  async beforeUpdate(entityId: string, _entity: DeepPartial<T>, userId: string): Promise<void> {
    const user: User = await this.userRepository.findOneOrFail({
      select: ['id', 'role'],
      where: {id: userId},
    });
    const entity: T = await this.repository.findOne({
      select: ['id', 'createdBy'],
      where: {id: entityId} as FindOptionsWhere<T>,
    });
    if (user.id != entity.createdBy || user.role != EUserRole.STAFF) throw new ForbiddenException('Acesso negado');
  }

  async beforeBulkUpdate(_entity: DeepPartial<T>, userId: string): Promise<void> {
    const user: User = await this.userRepository.findOneOrFail({
      select: ['id'],
      where: {id: userId},
    });
    if (user.id != _entity.createdBy) throw new ForbiddenException('Acesso negado');
  }

  async beforeDelete(entityId: string, userId: string): Promise<void> {
    const user: User = await this.userRepository.findOneOrFail({
      select: ['id'],
      where: {id: userId},
    });
    const entity: T = await this.repository.findOneOrFail({
      select: ['id', 'createdBy'],
      where: [{id: entityId}] as FindOptionsWhere<T>[],
    });
    if (user.id != entity.createdBy) throw new ForbiddenException('Acesso negado');
  }

  async beforeBulkDelete(params: WhereParam<T>[], userId: string): Promise<void> {
    if (!params?.length) throw new BadRequestException('Nenhum parâmetro fornecido');
    const user: User = await this.userRepository.findOneOrFail({
      select: ['id', 'role'],
      where: {id: userId},
    });
    if (user.role != EUserRole.STAFF) {
      for (const param of params) {
        param.createdBy = user.id;
      }
    }
  }
}
