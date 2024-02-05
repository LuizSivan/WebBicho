import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {EUserRole, User} from '../../shared/models/entities/user';
import {DeepPartial, Repository} from 'typeorm';
import bcrypt from 'bcrypt';
import {MailService} from '../../shared/services/mail.service';
import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import {TokenService} from '../../shared/services/token.service';
import {SECRET} from './auth.module';

@Injectable()
export class AuthService {
	constructor(
			@InjectRepository(User)
			private readonly userRepository: Repository<User>,
			private readonly mailService: MailService,
			private readonly tokenService: TokenService
	) {
	}
	
	public async login(
			username: string,
			password: string,
	): Promise<User> {
		const user: User = await this.userRepository.findOne({
			select: ['id', 'username', 'password', 'verified', 'createdAt'],
			where: [
				{username: username},
				{email: username}
			]
		});
		if (!user) throw new Error(`Usuário ${username} não encontrado!`);
		
		const passwordMatch: boolean = await bcrypt.compare(password, user.password);
		if (!passwordMatch) throw new Error('Login e/ou senha inválidos!');
		
		const cutoffTime: Date = new Date(Date.now() - 15 * 60 * 1000);
		if (!user.verified) {
			const deleteUser: boolean = user.createdAt < cutoffTime;
			if (deleteUser) {
				await this.userRepository.delete({id: user.id});
				throw new Error(`Usuário ${username} não encontrado!`);
			}
			throw new Error('Usuário não verificado!');
		}
		const login: User = await this.userRepository.findOneByOrFail({id: user.id});
		login.token = await this.tokenService.getToken(login);
		return login;
	}
	
	public async register(
			user: DeepPartial<User>
	): Promise<User> {
		const found: User | null = await this.userRepository.findOne({
			select: ['id', 'username', 'email'],
			where: [
				{username: user.username},
				{email: user.email},
			]
		});
		if (found) {
      throw new Error('Usuário e/ou e-mail já está em uso');
    }
		user.password = await bcrypt.hash(user.password as string, 10);
		await this.mailService.sendVerificationEmail(user);
		await this.userRepository.insert({...user, verified: false});
		return await this.userRepository.findOneByOrFail({id: user.id});
	}
	
	public async verifyAccount(
			token: string
	): Promise<User> {
		const payload: string | JwtPayload = jwt.verify(token, SECRET);
		const userEmail: string = payload.sub as string;
		const user: User = await this.userRepository.findOne({
			select: ['id', 'username', 'email', 'verified'],
			where: { email: userEmail },
		});
		
		if (user && !user.verified) {
			await this.userRepository.update({ id: user.id }, { ...user, verified: true });
			return await this.userRepository.findOneByOrFail({id: user.id});
		}
		throw new Error('Usuário já verificado ou não encontrado');
	}
}
