import {ApiProperty} from '@nestjs/swagger';
import {
  IsNotEmpty, MaxLength, MinLength
} from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    type: String,
    description: 'Nome OU email do usuário',
    minLength: 6,
    maxLength: 255,
  })
  @IsNotEmpty({message: 'Login não pode ser vazio!'})
  @MinLength(6, {message: 'Login deve ter no mínimo 6 caracteres!'})
  @MaxLength(255, {message: 'Login deve ter no máximo 255 caracteres!'})
  login: string;
  
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
