import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {
	EUserVerification,
	User
} from '../../shared/models/entities/user/user';
import {Repository} from 'typeorm';
import bcrypt from 'bcrypt';
import {MailService} from '../../shared/services/mail.service';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {TokenService} from '../../shared/services/token.service';
import {SECRET} from './auth.module';
import {UserRegisterDto} from '../../shared/models/entities/user/dto/user-register-dto';

@Injectable()
export class AuthService {
	constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly mailService: MailService,
      private readonly tokenService: TokenService,
	) {
	}
  
	/**
   * @description Realiza o login do usuário
   * @param {string} username - Nome ou email do usuário
   * @param {string} password - Senha do usuário
   * @return {Promise<User>} - A entidade do usuário com um token de acesso incluso
   * @throws {NotFoundException} - Usuário não encontrado
   * @throws {ForbiddenException} - Login e/ou senha inválidos ou usuário não verificado
   * */
	public async login(
			username: string,
			password: string,
	): Promise<User> {
		const user: User = await this.userRepository.findOne({
			select: ['id', 'username', 'password', 'verified', 'createdAt'],
			where: [
				{username: username},
				{email: username},
			],
		});
		if (!user) throw new NotFoundException(`Usuário ${username} não encontrado!`);
		const passwordMatch: boolean = await bcrypt.compare(password, user.password);
		if (!passwordMatch)
			throw new UnauthorizedException('Login e/ou senha inválidos!');
		const cutoffTime: Date = new Date(Date.now() - 15 * 60 * 1000);
		if (user.verified == EUserVerification.NON_VERIFIED) {
			const deleteUser: boolean = user.createdAt < cutoffTime;
			if (deleteUser) {
				await this.userRepository.delete({id: user.id});
				throw new NotFoundException(`Usuário ${username} não encontrado!`);
			}
			throw new ForbiddenException('Usuário não verificado!');
		}
		const login: User = await this.userRepository.findOneByOrFail({id: user.id});
		login.token = await this.tokenService.getToken(login);
		return login;
	}
  
	/**
   * @description Realiza o registro do usuário
   * @param {UserRegisterDto} userDto - Dados do usuário a serem registrados
   * @return {Promise<User>} - A entidade do usuário registrada
   * @throws {ConflictException} - Usuário e/ou e-mail já está em uso
   * */
	public async register(userDto: UserRegisterDto): Promise<User> {
		const found: User | null = await this.userRepository.findOne({
			select: ['id', 'username', 'email'],
			where: [
				{username: userDto.username},
				{email: userDto.email},
			],
		});
		if (found) {
			throw new ConflictException('Usuário e/ou e-mail já está em uso');
		}
		userDto.password = await bcrypt.hash(userDto.password as string, 10);
		await this.mailService.sendVerificationEmail(userDto);
		await this.userRepository.insert(userDto);
		return await this.userRepository.findOneByOrFail({username: userDto.username});
	}
  
	/**
   * @description Realiza a verificação da conta do usuário
   * @param {string} token - Token de verificação gerado e enviado por e-mail
   * @return {Promise<User>} - A entidade do usuário verificada
   * @throws {ConflictException} - Usuário já verificado ou não encontrado
   * */
	public async verifyAccount(token: string): Promise<User> {
		const payload: string | JwtPayload = jwt.verify(token, SECRET);
		const userEmail: string = payload.sub as string;
		const user: User = await this.userRepository.findOne({
			select: ['id', 'username', 'email', 'verified'],
			where: {email: userEmail},
		});
    
		if (user && user.verified == EUserVerification.NON_VERIFIED) {
			await this.userRepository.update({id: user.id}, {verified: EUserVerification.VERIFIED});
			return await this.userRepository.findOneByOrFail({id: user.id});
		}
		throw new ConflictException('Usuário já verificado ou não encontrado');
	}
}
