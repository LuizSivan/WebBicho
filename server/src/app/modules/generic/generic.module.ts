import {Module} from '@nestjs/common';
import {GenericController} from './generic.controller';
import {GenericService} from '../../shared/services/generic.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GenericEntity} from '../../shared/models/entities/generic-entity';

@Module({
	imports: [TypeOrmModule.forFeature([GenericEntity])],
	controllers: [GenericController],
	providers: [GenericService]
})
export class GenericModule {
}
