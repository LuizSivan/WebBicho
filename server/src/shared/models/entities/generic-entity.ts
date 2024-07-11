import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import {ApiHideProperty} from '@nestjs/swagger';

export class GenericEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;
	
	@Column({nullable: true})
	createdBy?: number;
	
	@Column({nullable: true})
	@ApiHideProperty()
	updatedBy?: number;
	
	@CreateDateColumn()
	createdAt: Date;
	
	@UpdateDateColumn()
	updatedAt: Date;
	
	@DeleteDateColumn()
	deletedAt: Date;
}
