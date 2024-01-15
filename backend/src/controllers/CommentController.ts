import GenericController from './GenericController';
import { Comment } from '../models/entities/Comment';
import { Request, Response } from 'express';
import { getRepository } from '../database/datasource';

class CommentController extends GenericController<Comment> {
	public async get(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.get(
				request,
				response,
				getRepository(Comment)
		);
	}
	
	public async getById(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.getById(
				request,
				response,
				getRepository(Comment)
		);
	}
	
	public async create(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.create(
				request,
				response,
				getRepository(Comment)
		);
	}
	
	public async update(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.update(
				request,
				response,
				getRepository(Comment)
		);
	}
	
	public async delete(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.delete(
				request,
				response,
				getRepository(Comment)
		);
	}
}

export default new CommentController();
