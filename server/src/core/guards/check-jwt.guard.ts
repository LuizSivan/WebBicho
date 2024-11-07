import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {User} from '../../shared/models/entities/user/user';
import {InjectRepository} from '@nestjs/typeorm';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {Request, Response} from 'express';
import {HEADER} from '../cors/headers';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class CheckJwtGuard implements CanActivate {
  
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly env: ConfigService,
  ) {
  }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const token: string = request.headers[HEADER.AUTH] as string;
    try {
      const SECRET: string = this.env.get('JWT_SECRET');
      const decoded: JwtPayload | string = jwt.verify(token, SECRET);
      response.locals.jwtPayload = decoded;
      const user: User = await this.userRepository.findOneOrFail({
        select: ['uuid'],
        where: {email: decoded.sub as string},
      });
      request.headers[HEADER.USER_ID] = user.uuid.toString();
      return true;
    } catch (error) {
      throw new ForbiddenException('Não foi possível autorizar a requisição.');
    }
  }
}
