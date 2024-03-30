import {GenericEntity} from '../generic-entity';
import {Column, Entity, ManyToOne} from 'typeorm';
import {User} from '../user/user';
import {Post} from '../post/post';

@Entity()
export class Comment extends GenericEntity {
  @Column({length: 1000})
  content: string;
  
  @ManyToOne(
      () => User,
      user => user.comments,
  )
  user: User;
  
  @ManyToOne(
      () => Post,
      post => post.comments,
  )
  post: Post;
}
