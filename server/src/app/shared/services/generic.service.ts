import {Injectable} from '@nestjs/common';
import {GenericEntity} from '../models/entities/generic-entity';
import {DeepPartial, FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository} from 'typeorm';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity';
import {Page} from '../models/classes/page';

@Injectable()
export abstract class GenericService<T extends GenericEntity> {
	protected repository: Repository<T>;
	
	protected constructor(
			repository: Repository<T>
	) {
		this.repository = repository;
	}
	
	async findOne(
			fields: string[],
			relations: string[],
			params: any[],
			entityId: string
	): Promise<T> {
		try {
			const options: FindOneOptions = {
				select: fields ?? undefined,
				relations: relations,
				where: params.map(p => ({...p, id: entityId})),
			};
			return await this.repository.findOne(options);
		} catch (e: any) {
			throw new Error(`Erro ao buscar ${this.repository.metadata.name} ${entityId}: ${e.message}`);
		}
	}
	
	async list(
			page: number,
			size: number,
			fields: string[],
			relations: string[],
			params: any[],
			order: FindOptionsOrder<T>,
	): Promise<Page<T>> {
		try {
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
		} catch (e) {
			throw new Error(`Erro ao buscar lista de ${this.repository.metadata.name}: ${e.message}`);
		}
	}
	
	async create(
			entity: DeepPartial<T>,
			userId: string
	): Promise<T> {
		const exists: boolean = await this.repository.existsBy({id: entity?.id} as FindOptionsWhere<T>);
		if (exists) {
			throw new Error(`${this.repository.metadata.name} já existe!`);
		}
		try {
			entity.createdBy = userId;
			entity.updatedBy = userId;
			await this.repository.insert(entity as QueryDeepPartialEntity<T>);
			return await this.repository.findOneByOrFail({id: entity.id} as FindOptionsWhere<T>);
		} catch (e: any) {
			throw new Error(`Erro ao criar ${this.repository.metadata.name}: ${e.message}`);
		}
	}
	
	async update(
			entity: DeepPartial<T>,
			userId: string
	): Promise<T> {
		const exists: boolean = await this.repository.existsBy({id: entity?.id} as FindOptionsWhere<T>);
		if (!exists) {
			throw new Error(`${this.repository.metadata.name} não encontrado!`);
		}
		try {
			entity.updatedBy = userId;
			await this.repository.update(
					{id: entity.id} as FindOptionsWhere<T>,
					entity as QueryDeepPartialEntity<T>
			);
			return await this.repository.findOneByOrFail({id: entity.id} as FindOptionsWhere<T>);
		} catch (e: any) {
			throw new Error(`Erro ao atualizar ${this.repository.metadata.name}: ${e.message}`);
		}
	}
	
	async delete(entityId: string): Promise<void> {
		const exists: boolean = await this.repository.existsBy({id: entityId} as FindOptionsWhere<T>);
		if (!exists) {
			throw new Error(`${this.repository.metadata.name} não encontrado!`);
		}
		try {
			await this.repository.delete({id: entityId} as FindOptionsWhere<T>);
		} catch (e: any) {
			throw new Error(`Erro ao deletar ${this.repository.metadata.name}: ${e.message}`);
		}
	}
}
