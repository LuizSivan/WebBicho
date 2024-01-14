import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class GenericEntity extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;
	
	@Column({nullable: true, default: ''})
	createdBy?: string;
	
	@Column({nullable: true, default: ''})
	updatedBy?: string;
	
	@CreateDateColumn()
	createdAt?: Date;
	
	@UpdateDateColumn()
	updatedAt?: Date;
	
	@Column({default: false})
	deleted?: boolean = false;
}
