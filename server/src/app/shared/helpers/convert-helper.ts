import fs from 'fs';
import {
	Between,
	FindOperator,
	FindOptionsWhere,
	In,
	IsNull,
	LessThan,
	LessThanOrEqual,
	MoreThan,
	MoreThanOrEqual,
	Not
} from 'typeorm';
import {WhereParam} from '../models/types/where-param';

export function readFileAsBase64(filePath: string): string {
	try {
		return fs.readFileSync(filePath, {encoding: 'base64'});
	} catch (error) {
		console.error(`Erro ao ler o arquivo ${filePath} em base64:`, error);
		throw error;
	}
}

export function convertParams<T>(
		params: WhereParam<T>[]
): FindOptionsWhere<T>[] {
	const newParams: FindOptionsWhere<T>[] = [];
	for (const param of params) {
		newParams.push(convertParam(param));
	}
	return newParams;
}

export function convertParam<T>(params: WhereParam<T>): FindOptionsWhere<T> {
	let newParams: FindOptionsWhere<any> = {};
	for (const key in params) {
		if (!params.hasOwnProperty(key)) continue;
		let condition = params[key];
		if (condition.hasOwnProperty('equals'))
			newParams[key] = condition['equals'];
		else if (condition.hasOwnProperty('between'))
			newParams[key] = Between(condition['between'][0], condition['between'][1]);
		else if (condition.hasOwnProperty('in'))
			newParams[key] = In(condition['in']);
		else if (condition.hasOwnProperty('like'))
			newParams[key] = new FindOperator('ilike', `unaccent(${condition['like']})`);
		else if (condition.hasOwnProperty('greaterThan'))
			newParams[key] = MoreThan(condition['greaterThan']);
		else if (condition.hasOwnProperty('greaterThanOrEquals'))
			newParams[key] = MoreThanOrEqual(condition['greaterThanOrEquals']);
		else if (condition.hasOwnProperty('lessThan'))
			newParams[key] = LessThan(condition['lessThan']);
		else if (condition.hasOwnProperty('lessThanOrEquals'))
			newParams[key] = LessThanOrEqual(condition['lessThanOrEquals']);
		else if (condition.hasOwnProperty('notEquals'))
			newParams[key] = Not(condition['notEquals']);
		else if (condition.hasOwnProperty('notBetween'))
			newParams[key] = Not(Between(condition['notBetween'][0], condition['notBetween'][1]));
		else if (condition.hasOwnProperty('notIn'))
			newParams[key] = Not(In(condition['notIn']));
		else if (condition.hasOwnProperty('notLike'))
			newParams[key] = Not(new FindOperator('ilike', `unaccent(${condition['notLike']})`));
		else if (condition.hasOwnProperty('isNull'))
			newParams[key] = IsNull();
		else if (condition.hasOwnProperty('notNull'))
			newParams[key] = Not(IsNull());
		else if (typeof condition === 'object')
			newParams[key] = convertParam(condition);
	}
	return newParams;
}
