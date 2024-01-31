import {User} from './user';
import {Post} from './post';
import {GenericEntity} from './generic-entity';

export class Comment extends GenericEntity {
	content: string;
	user: User;
	post: Post;
}
