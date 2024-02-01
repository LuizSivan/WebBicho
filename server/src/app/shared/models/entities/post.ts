import {GenericEntity} from './generic-entity';
import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {User} from './user';

@Entity()
export class Post extends GenericEntity {
	@Column({type: 'text'})
	content: string;
	
	@Column({type: 'text', nullable: true})
	file: string;
	
	@ManyToOne(() => User)
	@JoinColumn({name: 'user'})
	user: User;
}
