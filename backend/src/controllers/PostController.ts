import GenericController from './GenericController';
import { Post } from '../models/entities/Post';
import { Request, Response } from 'express';
import { getRepository } from '../database/datasource';

class PostController extends GenericController<Post> {
	public async get(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.get(
				request,
				response,
				getRepository(Post)
		);
	}
	
	public async getById(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.getById(
				request,
				response,
				getRepository(Post)
		);
	}
	
	public async create(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.create(
				request,
				response,
				getRepository(Post)
		);
	}
	
	public async update(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.update(
				request,
				response,
				getRepository(Post)
		);
	}
	
	public async delete(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.delete(
				request,
				response,
				getRepository(Post)
		);
	}
}

export default new PostController();
