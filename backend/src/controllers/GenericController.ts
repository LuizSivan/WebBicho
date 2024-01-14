import { Request, Response } from 'express';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { GenericEntity } from '../models/entities/GenericEntity';
import { Page } from '../models/classes/Page';

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
			const paged: Page<T> = new Page(data, count, pageSize, page);
			return response.status(200).json(paged);
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
	
	public async getById(
			request: Request,
			response: Response,
			repository: Repository<ObjectLiteral>
	): Promise<any> {
		try {
			const id: string = request.query?.id as string;
			const data: ObjectLiteral | null = await repository.findOneBy({id: id});
			if (data) {
				return response.status(200).json(data);
			}
			return response.status(204).send();
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
}

export default GenericController;
