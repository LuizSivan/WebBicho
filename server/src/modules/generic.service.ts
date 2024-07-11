import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
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
import {
	convertParam,
	convertParams
} from '../shared/helpers/convert-helper';
import {WhereParam} from '../shared/models/types/where-param';
import {
	EUserRole,
	User
} from '../shared/models/entities/user/user';

@Injectable()
export abstract class GenericService<
	T extends GenericEntity,
	CT extends GenericEntity,
	UT extends GenericEntity,
> {
	public readonly entityName: string;
	
	protected constructor(
			public readonly repository: Repository<T>,
			public readonly userRepository: Repository<User>,
	) {
		this.entityName = this.repository.metadata.name;
	}
	
	/**
	 * @description Busca uma única entidade do tipo T no repositório.
	 * @param {number} entityId (opcional) id da entidade.
	 * @param {string[]} fields (opcional) campos a serem buscados na consulta.
	 * @param {string[]} relations (opcional) relações a serem carregadas na consulta.
	 * @param {WhereParam[]} params (opcional) parâmetros de busca da consulta.
	 * @returns {Promise} - a entidade encontrada.
	 * @throws BadRequestException se nenhum parâmetro for informado.*/
	public async findOne(
			entityId?: number,
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
	 * @description Busca uma lista de entidades do tipo T no repositório.
	 * @param {number} page número da página.
	 * @param {number} size número de itens a serem carregados
	 * @param {string[]} fields (opcional) campos a serem buscados na consulta
	 * @param {string[]} relations (opcional) relações a serem carregadas na consulta
	 * @param {WhereParam[]} params (opcional) parâmetros de busca da consulta
	 * @param {string[]} order (opcional) ordem de resultado da consulta
	 * @returns {Page} a página de entidades encontradas*/
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
	
	/**
	 * @description Cria uma nova entidade do tipo T no repositório.
	 * @param {Object} entity - entidade parcial a ser criada.
	 * @param {number} userId - id do usuário que está criando a entidade.
	 * @returns {Promise} a entidade criada.*/
	public async create(
			entity: CT,
			userId: number,
	): Promise<T> {
		await this.beforeCreate(entity);
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
	
	/**
	 * @description Atualiza uma entidade no repositório pelo uuid.
	 * @param {number} entityId - id da entidade a ser atualizada.
	 * @param {Object} entity - entidade parcial com novas alterações.
	 * @param {number} userId - id do usuário que está atualizando a entidade.
	 * @returns {Promise} a entidade atualizada.
	 * @throws NotFoundException se a entidade não for encontrada.*/
	public async update(
			entityId: number,
			entity: UT,
			userId: number,
	): Promise<T> {
		await this.beforeUpdate(entityId, entity, userId);
		const queryRunner: QueryRunner = this.repository.manager.connection.createQueryRunner();
		const exists: boolean = await this.repository.existsBy(
				{id: entityId} as FindOptionsWhere<T>
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
	
	/**
	 * @description Atualiza várias entidades por parâmetros.
	 * @param {DeepPartial} entity - entidade parcial com novas alterações.
	 * @param {number} userId - id do usuário que está atualizando a entidade.
	 * @param {WhereParam[]} params - parâmetros de busca das entidades a serem atualizadas.*/
	public async bulkUpdate(
			entity: DeepPartial<T>,
			userId: number,
			params: WhereParam<T>[],
	): Promise<void> {
		await this.beforeBulkUpdate(entity, userId);
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
	
	/**
	 * @description Deleta uma entidade do repositório pelo uuid.
	 * @param {number} entityId - uuid da entidade a ser deletada.
	 * @param {number} userId - uuid do usuário que está deletando a entidade.
	 * @throws NotFoundException se a entidade não for encontrada.*/
	public async delete(
			entityId: number,
			userId: number,
	): Promise<void> {
		await this.beforeDelete(entityId, userId);
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
					{id: entityId} as FindOptionsWhere<T>
			);
			await queryRunner.commitTransaction();
		} catch (e) {
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}
	
	/**
	 * @description Deleta várias entidades por parâmetros.
	 * @param {WhereParam[]} params - parâmetros de busca das entidades a serem deletadas.
	 * @param {number} userId - id do usuário que está deletando as entidades.*/
	public async bulkDelete(
			params: WhereParam<T>[],
			userId: number,
	): Promise<void> {
		await this.beforeBulkDelete(params, userId);
		const convertedParams: FindOptionsWhere<T>[] = convertParams(params);
		const exists: boolean = await this.repository.existsBy(convertedParams);
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
	
	/**
	 * @description Método chamado antes de criar uma entidade.
	 * @param {DeepPartial} _entity - entidade parcial a ser criada.*/
	protected async beforeCreate(_entity: CT): Promise<void> {
		return Promise.resolve();
	}
	
	/**
	 * @description Método chamado antes de atualizar uma entidade.
	 * @param {string} entityId - uuid da entidade a ser atualizada.
	 * @param {DeepPartial} _entity - entidade parcial com novas alterações.
	 * @param {string} userId - uuid do usuário que está atualizando a entidade.*/
	protected async beforeUpdate(
			entityId: number,
			_entity: UT,
			userId: number,
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
	
	/**
	 * @description Método chamado antes de atualizar várias entidades.
	 * @param {DeepPartial} _entity - entidade parcial com novas alterações.
	 * @param {number} userId - id do usuário que está atualizando a entidade.*/
	protected async beforeBulkUpdate(
			_entity: DeepPartial<T>,
			userId: number,
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
	
	/**
	 * @description Método chamado antes de deletar uma entidade.
	 * @param {number} entityId - id da entidade a ser deletada.
	 * @param {number} userId - id do usuário que está deletando a entidade.*/
	protected async beforeDelete(
			entityId: number,
			userId: number
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
	
	/**
	 * @description Método chamado antes de deletar várias entidades.
	 * @param {WhereParam[]} params - parâmetros de busca das entidades a serem deletadas.
	 * @param {number} userId - id do usuário que está deletando as entidades.*/
	protected async beforeBulkDelete(
			params: WhereParam<T>[],
			userId: number,
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
