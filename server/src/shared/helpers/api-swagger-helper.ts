import {applyDecorators} from '@nestjs/common';
import {
	ApiHeader,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiParam
} from '@nestjs/swagger';
import {PATH} from '../../core/cors/paths';
import {HEADER} from '../../core/cors/headers';

export function ApiListDecorators(): MethodDecorator {
	return applyDecorators(
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

export function ApiFindOneDecorators(): MethodDecorator {
	return applyDecorators(
			ApiOperation({summary: 'Retorna apenas uma entidade'}),
			ApiParam({name: 'id', required: false, description: 'Id da entidade'}),
			ApiHeader({name: HEADER.FIELDS, required: false, description: 'Campos da entidade a serem buscados'}),
			ApiHeader({name: HEADER.RELATIONS, required: false, description: 'Relações a serem carregadas'}),
			ApiHeader({name: HEADER.PARAMS, required: false, description: 'Parâmetros da busca'}),
			ApiInternalServerErrorResponse({description: 'Erro ao buscar entidade'})
	);
}
