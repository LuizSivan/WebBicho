import { NextFunction, Request, Response } from 'express';
import { EUserRole, User } from '../models/entities/User';
import { getRepository } from '../database/datasource';
import jwt from 'jsonwebtoken';

export const secret: string = '@WebBichoIn2024!';

const HEADER_USER: string = 'user';

export async function checkJwt(
		request: Request,
		response: Response,
		next: NextFunction,
): Promise<any> {
	try {
		const token: string = request.headers['auth'] as string;
		try {
			response.locals.jwtPayload = jwt.verify(token, secret);
		} catch (error: any) {
			return response.status(401).send('Não foi possível autorizar a requisição.');
		}
		const userId: string = request.query?.id as string;
		const user: User = await getRepository(User).findOneOrFail({
			select: ['id'],
			where: {id: userId}
		});
		request.headers[HEADER_USER] = user.id;
		next();
	} catch (error: any) {
		return response.status(500).json({message: error.message});
	}
}

export async function checkIsAdmin(
		request: Request,
		response: Response,
		next: NextFunction,
): Promise<any> {
	try {
		const token: string = request.headers['auth'] as string;
		try {
			response.locals.jwtPayload = jwt.verify(token, secret);
		} catch (error: any) {
			return response.status(401).send('Não foi possível autorizar a requisição.');
		}
		const userId: string = request.query?.id as string;
		const user: User = await getRepository(User).findOneOrFail({
			select: ['id'],
			where: {id: userId, role: EUserRole.ADMINISTRATOR}
		});
		request.headers[HEADER_USER] = user.id;
		next();
	} catch (error: any) {
		return response.status(403).json({message: error.message});
	}
}


