import { Request, Response } from 'express';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { GenericEntity } from '../models/GenericEntity';
import { Page } from '../models/classes/Page';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

class GenericController<T extends GenericEntity> {
	public async get(
			request: Request,
			response: Response,
			repository: Repository<T>
	): Promise<any> {
		try {
			const pageSize: number = 9;
			const page: number = parseInt(request?.query?.page as string, 10) || 1;
			const options: FindManyOptions = {
				take: pageSize,
				skip: (page - 1) * pageSize,
			};
			const [data, count]: [T[], number] = await repository.findAndCount(options);
			const paged: Page<T> = new Page(data, page, Math.ceil(count / pageSize), count);
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
