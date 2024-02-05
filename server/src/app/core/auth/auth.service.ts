import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user';
import {Repository} from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
			@InjectRepository(User) private readonly userRepository: Repository<User>
	) {
	}
	
	public async login(
			username: string,
			password: string,
	): Promise<User | string> {
		const user: User = await this.userRepository.findOne({
			select: ['id', 'username', 'password', 'verified', 'createdAt'],
			where: [
				{username: username},
				{email: username}
			]
		});
		if (!user) throw new Error(`Usuário ${username} não encontrado!`);
		
		const passwordMatch: boolean = await bcrypt.compare(password, user.password);
		if (!passwordMatch) throw new Error('Login e/ou senha inválidos');
		
		const cutoffTime: Date = new Date(Date.now() - 15 * 60 * 1000);
		if (!user.verified) {
			const deleteUser: boolean = user.createdAt < cutoffTime;
			if (deleteUser) {
				await this.userRepository.delete({id: user.id});
				throw new Error(`Usuário ${username} não encontrado!`);
			}
			throw new Error('Usuário não verificado');
		}
		
		delete user.password;
		return user;
	}
}
