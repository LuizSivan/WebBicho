import {
	applyDecorators,
	Delete,
	Get,
	Post,
	Put
} from '@nestjs/common';
import {
	ApiHeader,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiParam
} from '@nestjs/swagger';
import {PATH} from '../../core/cors/paths';
import {HEADER} from '../../core/cors/headers';

export function ApiFindOneOperation(): MethodDecorator {
	return applyDecorators(
			Get(':id?'),
			ApiOperation({summary: 'Retorna apenas uma entidade'}),
			ApiParam({name: 'id', required: false, description: 'Id da entidade'}),
			ApiHeader({name: HEADER.FIELDS, required: false, description: 'Campos da entidade a serem buscados'}),
			ApiHeader({name: HEADER.RELATIONS, required: false, description: 'Relações a serem carregadas'}),
			ApiHeader({name: HEADER.PARAMS, required: false, description: 'Parâmetros da busca'}),
			ApiInternalServerErrorResponse({description: 'Erro ao buscar entidade'})
	);
}

export function ApiListOperation(): MethodDecorator {
	return applyDecorators(
			Get('page/:page/size/:size'),
			ApiOperation({summary: 'Retorna uma lista de entidades'}),
			ApiParam({name: PATH.PAGE, description: 'Número da página'}),
			ApiParam({name: PATH.SIZE, description: 'Tamanho da página'}),
			ApiHeader({name: HEADER.AUTH, required: true, description: 'Token de autenticação'}),
			ApiHeader({name: HEADER.FIELDS, required: false, description: 'Campos da entidade a sem buscados'}),
			ApiHeader({name: HEADER.RELATIONS, required: false, description: 'Relações a serem carregadas'}),
			ApiHeader({name: HEADER.PARAMS, required: false, description: 'Parâmetros da busca'}),
			ApiHeader({name: HEADER.ORDER, required: false, description: 'Ordem da busca'}),
			ApiInternalServerErrorResponse({description: 'Erro ao buscar lista de entidades'}),
	);
}

export function ApiCreateOperation(): MethodDecorator {
	return applyDecorators(
			Post(),
			ApiOperation({summary: 'Cria uma entidade'}),
			ApiHeader({name: HEADER.USER_ID, description: 'Id do usuário'}),
			ApiInternalServerErrorResponse({description: 'Erro ao criar entidade'}),
	);
}

export function ApiUpdateOperation(): MethodDecorator {
	return applyDecorators(
			Put(':id'),
			ApiOperation({summary: 'Atualiza uma entidade via id'}),
			ApiParam({name: 'id', description: 'Id da entidade'}),
			ApiHeader({name: HEADER.USER_ID, description: 'Id do usuário'}),
	);
}

export function ApiBulkUpdateOperation(): MethodDecorator {
	return applyDecorators(
			Put('bulk'),
			ApiOperation({summary: 'Atualiza várias entidades via parâmetros'}),
			ApiHeader({name: HEADER.USER_ID, description: 'Id do usuário'}),
			ApiHeader({name: HEADER.PARAMS, description: 'Parâmetros da busca'}),
	);
}

export function ApiDeleteOperation(): MethodDecorator {
	return applyDecorators(
			Delete(':id'),
			ApiOperation({summary: 'Deleta uma entidade via id'}),
			ApiParam({name: 'id', description: 'Id da entidade'}),
			ApiHeader({name: HEADER.USER_ID, description: 'Id do usuário'}),
	);
}

export function ApiBulkDeleteOperation(): MethodDecorator {
	return applyDecorators(
			Delete('bulk'),
			ApiOperation({summary: 'Deleta várias entidades via parâmetros'}),
			ApiHeader({name: HEADER.USER_ID, description: 'Id do usuário'}),
			ApiHeader({name: HEADER.PARAMS, description: 'Parâmetros da busca'}),
	);
}



