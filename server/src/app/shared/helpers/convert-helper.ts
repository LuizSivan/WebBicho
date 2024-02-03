import fs from 'fs';
import {Between, FindOptionsWhere, In, Not, Raw} from 'typeorm';
import {Comparators, WhereKey, WhereParam} from '../models/types/where-param';
import {GenericEntity} from '../models/entities/generic-entity';

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

export function convertParams2<T extends GenericEntity>(
		params: WhereParam<T>[]
): FindOptionsWhere<T>[] {
	const newParams: FindOptionsWhere<T>[] = [];
	for (const param of params) {
		newParams.push(convertParam(param));
	}
	return newParams;
}

export function convertParam<T extends GenericEntity>(param: WhereParam<T>): FindOptionsWhere<T> {
	let newParam: FindOptionsWhere<T> = {};
	
	for (const key in param) {
		if (Comparators.some(prop => param[key].hasOwnProperty(prop))) {
			// This is a WhereKey. Convert it to a compatible format.
			newParam[key] = convertWhereKey(param[key]);
		} else {
			// This is a nested object. Call the function recursively.
			newParam[key] = convertParam(param[key]);
		}
	}
	
	return newParam;
}

function convertWhereKey<T extends GenericEntity>(comparator: WhereKey<T>) {
	switch (comparator)
}
