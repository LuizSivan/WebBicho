import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user';
import {Repository} from 'typeorm';
import {Request, Response} from 'express';
import {HEADER_TOKEN, HEADER_USER, SECRET} from '../../modules/auth/auth.module';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
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
    const token: string = request.headers[HEADER_TOKEN] as string;
    try {
      response.locals.jwtPayload = jwt.verify(token, SECRET);
      const userId: string = request.query?.id as string;
      const user: User = await this.userRepository.findOne({
        select: ['id'],
        where: {id: userId},
      });
      request.headers[HEADER_USER] = user.id;
      return true;
    } catch (error) {
      throw new ForbiddenException('Não foi possível autorizar a requisição.');
    }
  }
}
