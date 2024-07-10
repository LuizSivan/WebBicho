import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common';
import {SECRET} from '../../modules/auth/auth.module';
import {Repository} from 'typeorm';
import {User} from '../../shared/models/entities/user/user';
import {InjectRepository} from '@nestjs/typeorm';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {
	Request,
	Response
} from 'express';
import {HEADER} from '../cors/headers';

@Injectable()
export class CheckJwtGuard implements CanActivate {
	
	constructor(
			@InjectRepository(User)
			private readonly userRepository: Repository<User>,
	) {
	}
	
	async canActivate(
			context: ExecutionContext,
	): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const response: Response = context.switchToHttp().getResponse();
		const token: string = request.headers[HEADER.AUTH] as string;
		try {
			const decoded: JwtPayload | string = jwt.verify(token, SECRET);
			response.locals.jwtPayload = decoded;
			const user: User = await this.userRepository.findOneOrFail({
				select: ['id'],
				where: {email: decoded.sub as string},
			});
			request.headers[HEADER.USER_ID] = user.id.toString();
			return true;
		} catch (error) {
			throw new ForbiddenException('Não foi possível autorizar a requisição.');
		}
	}
}
