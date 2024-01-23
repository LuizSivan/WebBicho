import GenericController from './GenericController';
import {User} from '../models/entities/User';
import {Request, Response} from 'express';
import {getRepository} from '../database/datasource';

class UserController extends GenericController<User> {
	public async list(
			request: Request,
			response: Response,
	): Promise<any> {
		return super.list(
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
	
	public async update(
			request: Request,
			response: Response,
	): Promise<any> {
		this.removeFields(request);
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
	
	public removeFields(request: Request): void {
		delete request.body.password;
		delete request.body.verified;
		delete request.body.role;
	}
}

export default new UserController();
