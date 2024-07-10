import {GenericEntity} from '../generic-entity';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany
} from 'typeorm';
import {User} from '../user/user';
import {Comment} from '../comment/comment';

@Entity()
export class Post extends GenericEntity {
	@Column({type: 'text'})
	content: string;
	
	@Column({type: 'text', nullable: true})
	file: string;
	
	@ManyToOne(
			() => User,
			user => user.posts,
	)
	user: User;
	
	@OneToMany(
			() => Comment,
			comment => comment.post,
			{
				nullable: true,
				cascade: true,
			}
	)
	comments: Comment[];
}
