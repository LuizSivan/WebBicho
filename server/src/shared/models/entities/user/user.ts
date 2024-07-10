import {GenericEntity} from '../generic-entity';
import {
	Column,
	Entity,
	OneToMany
} from 'typeorm';
import {Post} from '../post/post';
import {Comment} from '../comment/comment';
import {ApiPropertyOptional} from '@nestjs/swagger';

export enum EUserRole {
	STAFF = 'STAFF',
	ORGANIZATION = 'ORGANIZATION',
	USER = 'USER',
}

export enum EUserVerification {
	NON_VERIFIED = 'NON_VERIFIED',
	VERIFIED = 'VERIFIED',
	PLUS_VERIFIED = 'PLUS_VERIFIED',
}

@Entity()
export class User extends GenericEntity {
	@Column({unique: true, length: 50})
	@ApiPropertyOptional({readOnly: true})
  username?: string;
  
	@Column({nullable: true, length: 255})
	@ApiPropertyOptional()
  name: string;
  
	@Column({unique: true, length: 255})
	@ApiPropertyOptional({readOnly: true})
  email?: string;
  
	@Column({select: false, length: 60})
	@ApiPropertyOptional({readOnly: true})
  password?: string;
  
	@Column({nullable: true, length: 400})
	@ApiPropertyOptional()
  about: string;
  
	@Column({
		type: 'enum',
		enum: EUserRole,
		default: EUserRole.USER,
	})
	@ApiPropertyOptional({readOnly: true})
  role?: EUserRole;
  
	@Column({type: 'text', nullable: true})
	@ApiPropertyOptional()
  avatar: string;
  
	@Column({
		type: 'enum',
		enum: EUserVerification,
		default: EUserVerification.NON_VERIFIED,
	})
	@ApiPropertyOptional({readOnly: true})
  verified?: EUserVerification;
  
	@OneToMany(
			() => Post,
			post => post.user,
			{
				nullable: true,
				cascade: ['soft-remove', 'remove'],
			}
	)
	@ApiPropertyOptional({readOnly: true})
  posts?: Post[];
  
	@OneToMany(
			() => Comment,
			comment => comment.user,
			{
				nullable: true,
				cascade: ['soft-remove', 'remove'],
			}
	)
	@ApiPropertyOptional({readOnly: true})
  comments?: Comment[];
  
	@ApiPropertyOptional({readOnly: true})
  token?: string;
}
