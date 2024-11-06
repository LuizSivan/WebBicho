import {
	Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import {ApiHideProperty} from '@nestjs/swagger';

export abstract class GenericEntity {
	@PrimaryGeneratedColumn('uuid')
  id?: string = undefined;
  
	@Column({
		type: 'uuid',
		nullable: true
	})
  createdBy?: string;
  
	@Column({
		type: 'uuid',
		nullable: true
	})
	@ApiHideProperty()
  updatedBy?: string;
  
	@CreateDateColumn()
  createdAt?: Date;
  
	@UpdateDateColumn()
  updatedAt?: Date;
  
	@DeleteDateColumn()
  deletedAt?: Date;
}
