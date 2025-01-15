import {
	Between,
	FindOptionsWhere,
	In,
	IsNull,
	LessThan,
	LessThanOrEqual,
	MoreThan,
	MoreThanOrEqual,
	Not,
	Raw,
} from 'typeorm';
import {WhereParam} from '../models/types/where-param';

export function convertParams<T>(params: WhereParam<T>[]): FindOptionsWhere<T>[] {
	return params?.map(param => {
		const newParam: FindOptionsWhere<T> = {};
		for (const field in param) {
			switch (true) {
				case field.startsWith('notEquals-'):
					newParam[field.replace('notEquals-', '')] = Not(param[field]);
					break;
				case field.startsWith('between-'):
					newParam[field.replace('between-', '')] = Between(param[field][0], param[field][1]);
					break;
				case field.startsWith('notBetween-'):
					newParam[field.replace('notBetween-', '')] = Not(Between(param[field][0], param[field][1]));
					break;
				case field.startsWith('in-'):
					newParam[field.replace('in-', '')] = In(param[field] as any[]);
					break;
				case field.startsWith('notIn-'):
					newParam[field.replace('notIn-', '')] = Not(In(param[field] as any[]));
					break;
				case field.startsWith('like-'):
					newParam[field.replace('like-', '')] = Raw(
							alias => `lower(unaccent(${alias})) ILIKE lower(unaccent(:value))`,
							{value: `%${param[field]}%`},
					);
					break;
				case field.startsWith('notLike-'):
					newParam[field.replace('notLike-', '')] = Not(Raw(
							alias => `lower(unaccent(${alias})) ILIKE lower(unaccent(:value))`,
							{value: `%${param[field]}%`},
					));
					break;
				case field.startsWith('greaterThan-'):
					newParam[field.replace('greaterThan-', '')] = MoreThan(param[field]);
					break;
				case field.startsWith('greaterThanOrEquals-'):
					newParam[field.replace('greaterThanOrEquals-', '')] = MoreThanOrEqual(param[field]);
					break;
				case field.startsWith('lessThan-'):
					newParam[field.replace('lessThan-', '')] = LessThan(param[field]);
					break;
				case field.startsWith('lessThanOrEquals-'):
					newParam[field.replace('lessThanOrEquals-', '')] = LessThanOrEqual(param[field]);
					break;
				case field.startsWith('isNull-'):
					newParam[field.replace('isNull-', '')] = IsNull();
					break;
				case field.startsWith('notNull-'):
					newParam[field.replace('notNull-', '')] = Not(IsNull());
					break;
			}
		}
		return newParam;
	});
}
