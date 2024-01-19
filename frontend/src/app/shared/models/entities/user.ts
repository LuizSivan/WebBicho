import { GenericEntity } from './generic-entity';

export enum EUserRole {
	ADMINISTRATOR = 'ADMINISTRATOR',
	ORGANIZATION = 'ORGANIZATION',
	USER = 'USER',
}

export class User extends GenericEntity {
	username: string;
	name: string;
	email: string;
	password?: string;
	about?: string;
	role: EUserRole;
	avatar?: string;
	verified?: boolean;
	token?: string;
	
	constructor() {
		super();
	}
}
