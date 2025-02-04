import {Module} from '@nestjs/common';
import {CommentService} from './comment.service';
import {CommentController} from './comment.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Comment} from '../../shared/models/entities/comment/comment';
import {UserModule} from '../user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Comment]),
		UserModule
	],
	providers: [CommentService],
	controllers: [CommentController],
})
export class CommentModule {
}
