import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GenericEntity } from '../GenericEntity';
import { User } from './User';

@Entity({name: 'posts'})
export class Post extends GenericEntity {
	@Column({type: 'text'})
	content: string;
	
	@Column({type: 'text', nullable: true})
	file: string;
	
	@ManyToOne(() => User)
	@JoinColumn({name: 'user'})
	user: User;
}
