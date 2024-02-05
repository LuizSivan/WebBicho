import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {HEADER_TOKEN, HEADER_USER, SECRET} from './auth.module';
import {Repository} from 'typeorm';
import {User} from '../../shared/models/entities/user';
import {InjectRepository} from '@nestjs/typeorm';
import jwt, {JwtPayload} from 'jsonwebtoken';
import { Request, Response } from 'express';

@Injectable()
export class CheckJwtGuardGuard implements CanActivate {
  
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>
  ) {}
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
        where: { id: userId },
      });
      request.headers[HEADER_USER] = user.id;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Não foi possível autorizar a requisição.');
    }
  }
}
