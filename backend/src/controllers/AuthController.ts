import { Request, Response } from 'express';
import { EUserRole, User } from '../models/entities/User';
import { getRepository } from '../database/datasource';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { secret } from '../auth/check-jwt';
import nodemailer, { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { HOST } from '../wb-server';

const transporter: Transporter = nodemailer.createTransport({
	service: process.env.SMTP,
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD,
	},
});

class AuthController {
	public async login(
			request: Request,
			response: Response,
	): Promise<any> {
		try {
			const {username, password} = request.body;
			const repository: Repository<User> = getRepository(User);
			const user: User | null = await repository.findOne({
				select: ['id', 'username', 'password', 'verified', 'createdAt'],
				where: [
					{username: username},
					{email: username}
				]
			});
			if (!user) {
				return response.status(404).json({message: 'Usuário não encontrado'});
			}
			const passwordMatch: boolean = await bcrypt.compare(password, user?.password as string);
			if (!passwordMatch) {
				return response.status(403).json({message: 'Login e/ou senha inválidos'});
			}
			const cutoffTime: Date = new Date(Date.now() - 15 * 60 * 1000);
			if (!user?.verified) {
				let message: string = 'Necessário realizar verificação';
				const deleteUser: boolean = user.createdAt < cutoffTime;
				if (deleteUser) {
					message = 'Usuário não encontrado';
					await repository.delete({id: user.id});
				}
				return response.status(deleteUser ? 404 : 403).json({message: message});
			}
			const login: User = await repository.findOneByOrFail({id: user.id});
			login.token = await getToken(login);
			return response.status(200).json(login);
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
	
	public async register(
			request: Request,
			response: Response,
	): Promise<any> {
		try {
			const {username, email} = request.body;
			const repository: Repository<User> = getRepository(User);
			const user: User | null = await repository.findOne({
				select: ['id', 'username', 'email'],
				where: [
					{username: username},
					{email: email},
				]
			});
			if (user) {
				return response.status(409).json({
					message: 'Usuário e/ou e-mail já está em uso',
					username: username == user?.username,
					email: email == user?.email,
				});
			}
			const newUser: User = {...request.body};
			newUser.password = await bcrypt.hash(newUser.password as string, 10);
			await sendVerificationEmail(newUser);
			await repository.insert({...newUser, verified: false});
			const saved: User = await repository.findOneByOrFail({id: newUser.id});
			return response.status(201).json(saved);
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
	
	public async verifyAccount(
			request: Request,
			response: Response
	): Promise<any> {
		try {
			const token: string = request.query.token as string;
			const payload: string | JwtPayload = jwt.verify(token, secret);
			response.locals.jwtPayload = payload;
			const userEmail: string = payload.sub as string;
			const repository: Repository<User> = getRepository(User);
			const user: User | null = await repository.findOne({
				select: ['id', 'username', 'email', 'verified'],
				where: {email: userEmail}
			});
			if (user && !user.verified) {
				await repository.update({id: user.id}, {...user, verified: true});
				const saved: User = await repository.findOneByOrFail({id: user.id});
				return response.status(200).json(saved);
			}
			return response.status(400).json({message: 'Usuário já verificado ou não encontrado'});
		} catch (error: any) {
			return response.status(500).json({message: error.message});
		}
	}
	
	public async authenticateToken(
			request: Request,
			response: Response
	): Promise<any> {
		try {
			const token: string = request.headers['auth'] as string;
			const decoded: JwtPayload = jwt.verify(token, secret) as JwtPayload;
			const expirationDate: Date = new Date(decoded?.exp as number * 1000);
			const formattedExpirationDate: string = new Intl.DateTimeFormat('pt-BR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				fractionalSecondDigits: 3,
			}).format(expirationDate);
			const json: any = {
				expirationDate: formattedExpirationDate,
				user: decoded.sub,
			};
			return response.status(200).json(json);
		} catch (error: any) {
			console.error('Erro ao decodificar o token:', error.message);
			return response.status(403).json({message: 'Acesso negado'});
		}
	}
}

async function getToken(user: User, expiration: string = '12h'): Promise<string> {
	const payload: object = {
		user: user.id,
		admin: user.role == EUserRole.ADMINISTRATOR
	};
	const options: SignOptions = {
		issuer: 'WB-SERVER',
		algorithm: 'HS256',
		subject: user.email,
		expiresIn: expiration,
	};
	return jwt.sign(payload, secret, options);
}

function sendVerificationEmail(user: User): Promise<void> {
	return new Promise(async (resolve, reject) => {
		const token: string = await getToken(user, '15m');
		const port: string = HOST.includes('127.0.0.1') ? ':4400' : '';
		const verificationLink: string = `${HOST}${port}/auth/verify?token=${token}`;
		const message: string = `
        <p>Olá, ${user?.name ?? user.username}!</p>
        <p>Bem-vindo à WebBicho. Para garantir a segurança da sua conta, por favor, clique no link abaixo para verificar seu endereço de e-mail:</p>
        <p><a href="${verificationLink}">Clique aqui para verificar seu e-mail</a></p>
        <p>Se você não solicitou a verificação da sua conta, por favor, ignore este e-mail.</p>
        <p>Atenciosamente,<br/>WebBicho</p>
    `;
		const mailOptions: MailOptions = {
			from: process.env.EMAIL,
			to: user?.email,
			subject: 'Verificação de conta',
			html: message
		};
		transporter.sendMail(mailOptions, (err: Error | null, info: any): void => {
			if (err) {
				console.error(`Erro ao enviar o e-mail: ${err.message}`);
				reject({message: `Erro ao enviar o e-mail de verificação: ${err.message}`});
			} else {
				console.log('E-mail enviado:', info);
				resolve();
			}
		});
	});
}

export default new AuthController();
