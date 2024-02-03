import {Injectable} from '@nestjs/common';
import {GenericEntity} from '../models/entities/generic-entity';
import {DeepPartial, FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository} from 'typeorm';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity';
import {Page} from '../models/classes/page';

@Injectable()
export abstract class GenericService<T extends GenericEntity> {
	public readonly entityName: string;
	protected repository: Repository<T>;
	
	protected constructor(
			repository: Repository<T>
	) {
		this.repository = repository;
		this.entityName = this.repository.metadata.name;
	}
	
	async findOne(
			fields: string[],
			relations: string[],
			params: any[],
			entityId: string
	): Promise<T> {
		const options: FindOneOptions = {
			select: fields,
			relations: relations,
			where: params.map(p => ({...p, id: entityId})),
		};
		return await this.repository.findOne(options);
	}
	
	async list(
			page: number,
			size: number,
			fields: string[],
			relations: string[],
			params: any[],
			order: FindOptionsOrder<T>,
	): Promise<Page<T>> {
		const options: FindManyOptions = {
			select: fields,
			relations: relations,
			where: params,
			skip: (page - 1) * size,
			take: size,
			order: order
		};
		const [data, count]: [T[], number] = await this.repository.findAndCount(options);
		return new Page(
				data,
				page,
				Math.ceil(count / size),
				count
		);
	}
	
	async create(
			entity: DeepPartial<T>,
			userId: string
	): Promise<T> {
		const exists: boolean = await this.repository.existsBy({id: entity?.id} as FindOptionsWhere<T>);
		if (exists) {
			throw new Error(`${this.repository.metadata.name} ${entity?.id} já existe!`);
		}
		entity.createdBy = userId;
		entity.updatedBy = userId;
		await this.repository.insert(entity as QueryDeepPartialEntity<T>);
		return await this.repository.findOneByOrFail({id: entity.id} as FindOptionsWhere<T>);
	}
	
	async update(
			entity: DeepPartial<T>,
			userId: string
	): Promise<T> {
		const exists: boolean = await this.repository.existsBy({id: entity?.id} as FindOptionsWhere<T>);
		if (!exists) {
			throw new Error(`${this.repository.metadata.name} não encontrado!`);
		}
		entity.updatedBy = userId;
		await this.repository.update(
				{id: entity.id} as FindOptionsWhere<T>,
				entity as QueryDeepPartialEntity<T>
		);
		return await this.repository.findOneByOrFail({id: entity.id} as FindOptionsWhere<T>);
	}
	
	async delete(entityId: string): Promise<void> {
		const exists: boolean = await this.repository.existsBy({id: entityId} as FindOptionsWhere<T>);
		if (!exists) {
			throw new Error(`${this.repository.metadata.name} não encontrado!`);
		}
		await this.repository.delete({id: entityId} as FindOptionsWhere<T>);
	}
}
