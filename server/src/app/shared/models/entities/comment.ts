import {GenericEntity} from './generic-entity';
import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {User} from './user';
import {Post} from './post';

@Entity()
export class Comment extends GenericEntity {
	@Column({length: 1000})
	content: string;
	
	@ManyToOne(() => User)
	@JoinColumn({name: 'user'})
	user: User;
	
	@ManyToOne(() => Post)
	@JoinColumn({name: 'post'})
	post: Post;
}
