import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user/user';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
	],
	exports: [TypeOrmModule],
	providers: [UserService],
	controllers: [UserController],
})
export class UserModule {
}
