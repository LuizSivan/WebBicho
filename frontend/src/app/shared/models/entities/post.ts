import {GenericEntity} from './generic-entity';
import {User} from './user';

export class Post extends GenericEntity {
	content: string;
	file: string;
	user: User;
}
