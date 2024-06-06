import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty} from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({
    type: String,
    description: 'Nome único de usuário',
    maxLength: 50,
  })
  @IsNotEmpty()
  username: string;
  
  @ApiPropertyOptional({
    type: String,
    description: 'Nome de exibição',
    maxLength: 255,
  })
  name?: string;
  
  @ApiProperty({
    type: String,
    description: 'Endereço de e-mail',
    maxLength: 255,
  })
  @IsEmail()
  email: string;
  
  @ApiProperty({
    type: String,
    description: 'Senha',
  })
  @IsNotEmpty()
  password: string;
}
