import GenericController from './GenericController';
import { User } from '../models/entities/User';
import { Request, Response } from 'express';
import { getRepository } from '../database/datasource';

class UserController extends GenericController<User> {
	public async get(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.get(
				request,
				response,
				getRepository(User)
		);
	}
	
	public async getById(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.getById(
				request,
				response,
				getRepository(User)
		);
	}
	
	public async create(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.create(
				request,
				response,
				getRepository(User)
		);
	}
	
	public async update(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.update(
				request,
				response,
				getRepository(User)
		);
	}
	
	public async delete(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.delete(
				request,
				response,
				getRepository(User)
		);
	}
}

export default new UserController();
