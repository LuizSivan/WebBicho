import fs from 'fs';
import {Between, FindOptionsWhere, In, Not, Raw} from 'typeorm';

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
