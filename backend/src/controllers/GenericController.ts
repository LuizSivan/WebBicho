import {Request, Response} from 'express';
import {FindManyOptions, FindOptionsWhere, Repository} from 'typeorm';
import {GenericEntity} from '../models/GenericEntity';
import {Page} from '../models/classes/Page';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity';
import {convertParams} from '../utils/utils';

const HEADER_FIELDS: string = 'fields';
const HEADER_PARAMS: string = 'search-params';
const HEADER_RELATIONS: string = 'relations';
const HEADER_SORT: string = 'sort-params';

class GenericController<T extends GenericEntity> {
	//TODO: Implementar um SearchParams para todas as rotas
	//TODO: Tratar a busca de usuários por dados sensíves
	public async list(
			request: Request,
			response: Response,
			repository: Repository<T>
	): Promise<any> {
		try {
			const fields: string[] = request.headers[HEADER_FIELDS] as string[];
			const relations: string[] = request.headers[HEADER_RELATIONS] as string[];
			const untreatedParams: any[] = request.headers[HEADER_PARAMS] as any[];
			const params: FindOptionsWhere<T> = convertParams(untreatedParams);
			const order: string = request.headers[HEADER_SORT] as string;
			const page: number = Number(request?.query?.page) || 1;
			const size: number = Number(request?.query?.size) || 9;
			const options: FindManyOptions = {
				select: fields ?? undefined,
				relations: relations ?? undefined,
				where: params ?? undefined,
				skip: (page - 1) * size,
				take: size,
			};
			const [data, count]: [T[], number] = await repository.findAndCount(options);
			const paged: Page<T> = new Page(
					data,
					page,
					Math.ceil(count / size),
					count
			);
			return response.status(200).json(paged);
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
	
	public async getById(
			request: Request,
			response: Response,
			repository: Repository<T>
	): Promise<any> {
		try {
			const id: string = request.params?.id as string;
			const data: T | null = await repository.findOneBy({id: id} as FindOptionsWhere<T>);
			if (data) {
				return response.status(200).json(data);
			}
			return response.status(204).send();
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
	
	public async create(
			request: Request,
			response: Response,
			repository: Repository<T>
	): Promise<any> {
		try {
			const entity: T = request.body as any;
			const userId: string = request.header('user-id') as string;
			entity.createdBy = userId;
			entity.updatedBy = userId;
			await repository.insert(entity as QueryDeepPartialEntity<T>);
			const saved: T | null = await repository.findOneByOrFail({id: entity.id} as FindOptionsWhere<T>);
			return response.status(201).json(saved);
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
	
	public async update(
			request: Request,
			response: Response,
			repository: Repository<T>
	): Promise<any> {
		try {
			const id: string = request.body?.id as string;
			const exists: boolean = await repository.existsBy({id: id} as FindOptionsWhere<T>);
			if (!exists) {
				return response.status(404).json({message: 'Entidade não encontrada'});
			}
			const entity: T = request.body;
			entity.updatedBy = request.header('user-id') as string;
			await repository.save(entity);
			const saved: T | null = await repository.findOneBy({id: id} as FindOptionsWhere<T>);
			return response.status(200).json(saved);
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
	
	public async delete(
			request: Request,
			response: Response,
			repository: Repository<T>
	): Promise<any> {
		try {
			const id: string = request.params?.id as string;
			const exists: boolean = await repository.existsBy({id: id} as FindOptionsWhere<T>);
			if (!exists) {
				return response.status(404).json({message: 'Entidade não encontrada'});
			}
			await repository.delete({id: id} as FindOptionsWhere<T>);
			return response.status(204).send();
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
}

export default GenericController;
