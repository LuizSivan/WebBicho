import {GenericEntity} from './generic-entity';
import {Column, Entity} from 'typeorm';

export enum EUserRole {
	ADMINISTRATOR = 'ADMINISTRATOR',
	ORGANIZATION = 'ORGANIZATION',
	USER = 'USER',
}

@Entity()
export class User extends GenericEntity {
	@Column({length: 50, unique: true})
	username: string;
	
	@Column({nullable: true, length: 255})
	name: string;
	
	@Column({length: 255, unique: true})
	email: string;
	
	@Column({select: false, length: 60})
	password?: string;
	
	@Column({nullable: true, length: 400})
	about: string;
	
	@Column({
		type: 'enum',
		enum: EUserRole,
		default: EUserRole.USER,
	})
	role?: EUserRole;
	
	@Column({type: 'text', nullable: true})
	avatar: string;
	
	@Column({default: false})
	verified?: boolean;
	
	token?: string;
}
