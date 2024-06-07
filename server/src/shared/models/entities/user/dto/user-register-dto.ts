import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
  IsEmail, IsNotEmpty, MaxLength, MinLength
} from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({
    type: String,
    description: 'Nome único de usuário',
    minLength: 6,
    maxLength: 50,
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  username: string;
  
  @ApiPropertyOptional({
    type: String,
    description: 'Nome de exibição',
    maxLength: 255,
  })
  @MaxLength(255)
  name?: string;
  
  @ApiProperty({
    type: String,
    description: 'Endereço de e-mail',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;
  
  @ApiProperty({
    type: String,
    description: 'Senha do usuário',
    maxLength: 40,
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(40)
  password: string;
}
