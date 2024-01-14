import { Request, Response } from 'express';
import { EUserRole, User } from '../models/entities/User';
import { getRepository } from '../database/datasource';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import jwt, { SignOptions } from 'jsonwebtoken';
import { secret } from '../auth/check-jwt';

class AuthController {
	public async login(
			request: Request,
			response: Response
	): Promise<any> {
		try {
			const {username, password} = request.body;
			const repository: Repository<User> = getRepository(User);
			const user: User = await repository.findOneOrFail({
				select: ['id', 'username', 'password'],
				where: [
					{username: username},
					{email: username}
				]
			});
			const passwordMatch: boolean = await bcrypt.compare(password, user?.password);
			if (passwordMatch) {
				const login: User = await repository.findOneByOrFail({id: user.id});
				login.token = await getToken(login);
				return response.status(200).json(login);
			}
			return response.status(403).json({message: 'Login e/ou senha inválidos'});
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
	
	public async register(
			request: Request,
			response: Response,
	): Promise<any> {
		try {
			const {username, email, ...profile} = request.body;
			const repository: Repository<User> = getRepository(User);
			const user: User | null = await repository.findOne({
				select: ['id', 'username', 'email'],
				where: [
					{username: username},
					{email: email}
				]
			});
			if (user) {
				return response.status(409).json({
					message: 'Usuário e/ou e-mail já está em uso',
					username: username == user?.username,
					email: email == user?.email,
				});
			}
			await repository.insert({...request.body});
			const newUser: User | null = await repository.findOneBy({username: profile.username});
			if (newUser) {
				newUser.token = await getToken(newUser);
				return response.status(201).json(newUser);
			}
			return response.status(500).json({message: 'Erro ao recuperar login'});
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
}

async function getToken(user: User): Promise<string> {
	const payload: object = {
		user: user.id,
		admin: user.role == EUserRole.ADMINISTRATOR
	};
	const options: SignOptions = {
		issuer: 'WB-SERVER',
		algorithm: 'HS256',
		subject: user.id,
		expiresIn: '12h',
	};
	return jwt.sign(payload, secret, options);
}

export default new AuthController();
