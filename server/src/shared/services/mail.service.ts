import {Injectable} from '@nestjs/common';
import path from 'node:path';
import fs from 'fs';
import nodemailer, {Transporter} from 'nodemailer';
import {MailOptions} from 'nodemailer/lib/smtp-pool';
import {TokenService} from './token.service';
import {ConfigService} from '@nestjs/config';
import {UserRegisterDto} from '../models/entities/user/dto/user-register-dto';
import {pathAssets} from '../../assets/path-assets';
import {EnvKey} from '../../core/env-key.enum';

@Injectable()
export class MailService {
  
	transporter: Transporter;
  
	constructor(
			private readonly tokenService: TokenService,
			private readonly env: ConfigService,
	) {
		this.transporter = nodemailer.createTransport({
			service: this.env.get<string>('SMTP'),
			port: 465,
			secure: true,
			auth: {
				user: this.env.get<string>('EMAIL'),
				pass: this.env.get<string>('PASSWORD'),
			},
		});
	}
  
	public sendVerificationEmail(user: UserRegisterDto): Promise<void> {
		return new Promise(async (resolve, reject): Promise<void> => {
			const token: string = await this.tokenService.getToken(user, '15m');
			const URL: string = this.env.get<string>(EnvKey.APP_HOST);
			const verificationLink: string = `${URL}/auth/verify?token=${token}`;
			const templatePath: string = path.join(pathAssets.html, 'account-verification.html');
			const htmlContent: string = fs.readFileSync(templatePath, 'utf-8')
					.replace('{{VERIFICATION_LINK}}', verificationLink)
					.replace('{{USER_NAME}}', user?.name ?? user.username);
			const mailOptions: MailOptions = this.getMailOptions(user, htmlContent);
			this.transporter.sendMail(mailOptions, (err: Error | null, info: any): void => {
				if (err) {
					console.error(`Erro ao enviar o e-mail: ${err.message}`);
					return reject({message: `Erro ao enviar o e-mail de verificação: ${err.message}`});
				} else {
					console.log('E-mail enviado:', info);
					return resolve();
				}
			});
		});
	}
  
	private getMailOptions(user: UserRegisterDto, htmlContent: string): MailOptions {
		return {
			from: `WebBicho Automático <${this.env.get<string>('EMAIL')}>`,
			to: user?.email,
			subject: 'Verificação de conta',
			html: htmlContent,
			attachments: [
				{
					filename: 'webbicho-verde.png',
					path: path.join(pathAssets.logos, 'webbicho-verde.png'),
					cid: 'webbicho@logo',
				},
			],
		};
	}
}
