import {Injectable} from '@nestjs/common';
import {DeepPartial} from 'typeorm';
import {EUserRole, User} from '../models/entities/user/user';
import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import {SECRET} from '../../modules/auth/auth.module';

@Injectable()
export class TokenService {
  
  /**
   * @description Gera um token de acesso para um usuário
   * @param {DeepPartial<User>} user - O usuário a ser autenticado
   * @param {string} expiration - O tempo de expiração do token
   * @return {Promise<string>} - O token gerado
   * */
  public async getToken(user: DeepPartial<User>, expiration: string = '12h'): Promise<string> {
    const payload: object = {
      user: user.id,
      admin: user.role == EUserRole.STAFF,
    };
    const options: SignOptions = {
      issuer: 'WB-SERVER',
      algorithm: 'HS256',
      subject: user.email,
      expiresIn: expiration,
    };
    return jwt.sign(payload, SECRET, options);
  }
  
  
  /**
   * @description Autentica um token de acesso
   * @param {string} token - O token a ser autenticado
   * @return {Promise<object>} - O payload do token
   * */
  public async authenticateToken(token: string): Promise<object> {
    const decoded: JwtPayload = jwt.verify(token, SECRET) as JwtPayload;
    const expirationDate: Date = new Date((decoded?.exp as number) * 1000);
    const formattedExpirationDate: string = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    }).format(expirationDate);
    return {
      expirationDate: formattedExpirationDate,
      user: decoded.sub,
    };
  }
}
