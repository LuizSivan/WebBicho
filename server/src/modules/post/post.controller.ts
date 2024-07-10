import {
	Controller,
	UseGuards
} from '@nestjs/common';
import {GenericController} from '../generic.controller';
import {Post} from '../../shared/models/entities/post/post';
import {PostService} from './post.service';
import {CheckJwtGuard} from '../../core/guards/check-jwt.guard';
import {ApiTags} from '@nestjs/swagger';
import {CreatePostDto} from '../../shared/models/entities/post/dto/create-post-dto';
import {UpdatePostDto} from '../../shared/models/entities/post/dto/update-post-dto';

@Controller('post')
@ApiTags('Postagens')
@UseGuards(CheckJwtGuard)
export class PostController
	extends GenericController<
		Post,
		PostService,
		CreatePostDto,
		UpdatePostDto
	> {
	
	constructor(service: PostService) {
		super(service);
	}
}
