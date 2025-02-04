import {Injectable} from '@nestjs/common';
import {GenericService} from '../generic.service';
import {Comment} from '../../shared/models/entities/comment/comment';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user/user';
import {CreateCommentDto} from '../../shared/models/entities/comment/dto/create-comment-dto';
import {UpdateCommentDto} from '../../shared/models/entities/comment/dto/update-comment-dto';

@Injectable()
export class CommentService extends GenericService<Comment, CreateCommentDto, UpdateCommentDto> {
	constructor(
			@InjectRepository(Comment)
			public readonly repository: Repository<Comment>,
			@InjectRepository(User)
			public readonly userRepository: Repository<User>
	) {
		super(repository, userRepository);
	}
}
