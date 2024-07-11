import {
	ApiProperty,
	ApiPropertyOptional
} from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	MaxLength,
	MinLength
} from 'class-validator';

export class UserRegisterDto {
	@ApiProperty({
		type: String,
		description: 'Nome único de usuário',
		minLength: 6,
		maxLength: 50,
	})
	@IsNotEmpty({message: 'Nome de usuário não pode ser vazio!'})
	@MinLength(6, {message: 'Nome de usuário deve ter no mínimo 6 caracteres!'})
	@MaxLength(50, {message: 'Nome de usuário deve ter no máximo 50 caracteres!'})
	username: string;
	
	@ApiPropertyOptional({
		type: String,
		description: 'Nome de exibição',
		maxLength: 255,
	})
	@MaxLength(255, {message: 'Nome de exibição deve ter no máximo 255 caracteres!'})
	name?: string;
	
	@ApiProperty({
		type: String,
		description: 'Endereço de e-mail',
	})
	@IsEmail(
			{
				domain_specific_validation: true,
				require_tld: true,
			},
			{
				message: 'E-mail inválido!'
			}
	)
	@MaxLength(255, {message: 'E-mail deve ter no máximo 255 caracteres!'})
	email: string;
	
	@ApiProperty({
		type: String,
		description: 'Senha do usuário',
		maxLength: 40,
		minLength: 8,
	})
	@IsNotEmpty({message: 'Senha não pode ser vazia!'})
	@MinLength(8, {message: 'Senha deve ter no mínimo 8 caracteres!'})
	@MaxLength(40, {message: 'Senha deve ter no máximo 40 caracteres!'})
	password: string;
}
