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
	Not,
	Raw
} from 'typeorm';
import {WhereParam} from '../models/types/where-param';

export function convertParams(searchParam: any[]): FindOptionsWhere<any> {
	for (const sp of searchParam) {
		for (const field in sp) {
			const value = sp[field];
			if (typeof value === 'string' && value.includes('%')) {
				sp[field] = Raw(alias => `unaccent(${alias}) ILIKE unaccent('${value}')`);
				
			} else if (typeof value === 'string' && value.startsWith('!')) {
				sp[field] = Not(value.replace('!', ''));
				
			} else if (field.startsWith('in-')) {
				const propertyName: string = field.replace('in-', '');
				sp[propertyName] = In(value);
				delete sp[field];
				
			} else if (field.startsWith('between-')) {
				const propertyName: string = field.replace('between-', '');
				sp[propertyName] = Between(value[0], value[1]);
				delete sp[field];
			}
		}
	}
	return searchParam;
}

export function readFileAsBase64(filePath: string): string {
	try {
		return fs.readFileSync(filePath, {encoding: 'base64'});
	} catch (error) {
		console.error(`Erro ao ler o arquivo ${filePath} em base64:`, error);
		throw error;
	}
}

export function convertParams2<T>(
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
