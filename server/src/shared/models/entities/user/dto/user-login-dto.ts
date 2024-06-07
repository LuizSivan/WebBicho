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
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  username: string;
  
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
