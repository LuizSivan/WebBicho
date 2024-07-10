import {Injectable} from '@nestjs/common';
import {User} from '../models/entities/user/user';
import path from 'node:path';
import fs from 'fs';
import nodemailer, {Transporter} from 'nodemailer';
import {HOST} from '../../main';
import {MailOptions} from 'nodemailer/lib/smtp-pool';
import {DeepPartial} from 'typeorm';
import {TokenService} from './token.service';

@Injectable()
export class MailService {
	
	transporter: Transporter;
	
	constructor(
			private readonly tokenService: TokenService,
	) {
		this.transporter = nodemailer.createTransport({
			service: process.env.SMTP,
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD,
			},
		});
	}
	
	public sendVerificationEmail(user: DeepPartial<User>): Promise<void> {
		return new Promise(async (resolve, reject): Promise<void> => {
			const token: string = await this.tokenService.getToken(user, '15m');
			const port: string = HOST.includes('127.0.0.1') ? ':4400' : '';
			const verificationLink: string = `${HOST}${port}/auth/verify?token=${token}`;
			const templatePath: string = path.join(__dirname, '../../assets/html/account-verification.html');
			const htmlContent: string = fs.readFileSync(templatePath, 'utf-8')
					.replace('{{VERIFICATION_LINK}}', verificationLink)
					.replace('{{USER_NAME}}', user?.name ?? user.username);
			const mailOptions: MailOptions = {
				from: `WebBicho Automático <${process.env.EMAIL}>`,
				to: user?.email,
				subject: 'Verificação de conta',
				html: htmlContent,
				attachments: [
					{
						filename: 'webbicho-verde.svg',
						path: 'src/assets/webbicho-verde.svg',
						cid: 'webbicho@logo',
					},
				],
			};
			this.transporter.sendMail(mailOptions, (err: Error | null, info: any): void => {
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
}
