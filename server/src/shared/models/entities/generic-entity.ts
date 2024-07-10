import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import {
	ApiHideProperty,
	ApiPropertyOptional
} from '@nestjs/swagger';
import {IsInt} from 'class-validator';

export class GenericEntity {
	@PrimaryGeneratedColumn('increment')
	@ApiPropertyOptional({
		type: 'integer',
		description: 'ID do registro',
		readOnly: true
	})
	@IsInt({message: 'ID do usuário deve ser um número inteiro!'})
  id: number;
  
	@Column({nullable: true})
	@ApiHideProperty()
	@IsInt({message: 'ID do usuário deve ser um número inteiro!'})
  createdBy?: number;
  
	@Column({nullable: true})
	@ApiHideProperty()
	@IsInt({message: 'ID do usuário deve ser um número inteiro!'})
  updatedBy?: number;
  
	@CreateDateColumn()
	@ApiHideProperty()
  createdAt: Date;
  
	@UpdateDateColumn()
	@ApiHideProperty()
  updatedAt: Date;
  
	@DeleteDateColumn()
	@ApiHideProperty()
  deletedAt: Date;
}
