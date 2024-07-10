import {GenericEntity} from '../../generic-entity';
import {ApiPropertyOptional} from '@nestjs/swagger';

export class UpdateUserDto extends GenericEntity {
	@ApiPropertyOptional()
  name: string;
  
	@ApiPropertyOptional()
  about: string;
  
	@ApiPropertyOptional()
  avatar: string;
  
	@ApiPropertyOptional({readOnly: true})
  token?: string;
}

/*OmitType(User, [
    'id',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'deletedAt',
    'username',
    'email',
    'password',
    'role',
    'verified',
    'posts',
    'comments',
  ])*/
