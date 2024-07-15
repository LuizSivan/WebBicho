import {
	CanActivate, ExecutionContext, ForbiddenException, Injectable
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user/user';
import {Repository} from 'typeorm';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {HEADER} from '../cors/headers';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly env: ConfigService
	) {
	}
  
	async canActivate(
			context: ExecutionContext,
	): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const response: Response = context.switchToHttp().getResponse();
		const token: string = request.headers[HEADER.AUTH] as string;
		try {
			const SECRET: string = this.env.get('JWT_SECRET');
			response.locals.jwtPayload = jwt.verify(token, SECRET);
			const userId: number = Number(request.query?.id);
			const user: User = await this.userRepository.findOne({
				select: ['id'],
				where: {id: userId},
			});
			request.headers[HEADER.USER_ID] = user.id.toString();
			return true;
		} catch (error) {
			throw new ForbiddenException('Não foi possível autorizar a requisição.');
		}
	}
}
