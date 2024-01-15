import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GenericEntity } from '../GenericEntity';
import { User } from './User';
import { Post } from './Post';

@Entity({name: 'comments'})
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
