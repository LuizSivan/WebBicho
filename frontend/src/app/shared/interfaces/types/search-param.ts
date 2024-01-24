export enum EComparisonOperator {
	equals = 'equals',
	between = 'between',
	in = 'in',
	like = 'like',
	greaterThan = 'greaterThan',
	greaterThanOrEquals = 'greaterThanOrEquals',
	lessThan = 'lessThan',
	lessThanOrEquals = 'lessThanOrEquals',
	notEquals = 'notEquals',
	notBetween = 'notBetween',
	notIn = 'notIn',
	notLike = 'notLike',
	isNull = 'isNull',
	notNull = 'notNull'
}

export type SearchParam<T> = {
	[P in keyof T]?: {
		equals?: T[P];
		between?: [T[P], T[P]];
		in?: T[P][];
		like?: string;
		greaterThan?: T[P];
		greaterThanOrEquals?: T[P];
		lessThan?: T[P];
		lessThanOrEquals?: T[P];
		notEquals?: T[P];
		notBetween?: [T[P], T[P]];
		notIn?: T[P][];
		notLike?: string;
		isNull?: any;
		notNull?: any;
	};
};

type SearchParamType<T, P extends keyof T> =
		| {equals: T[P]}
		| {between: [T[P], T[P]]}
		| {in: T[P][]}
		| {like: string}
		| {greaterThan: T[P]}
		| {greaterThanOrEquals: T[P]}
		| {lessThan: T[P]}
		| {lessThanOrEquals: T[P]}
		| {notEquals: T[P]}
		| {notBetween: [T[P], T[P]]}
		| {notIn: T[P][]}
		| {notLike: string}
		| {isNull: any}
		| {notNull: any};


export function createSearchParam<T, P extends keyof T>(
		value: T[P],
		operator: EComparisonOperator
): SearchParamType<T, P> {
	switch (operator) {
		case EComparisonOperator.equals:
			return {equals: value};
		case EComparisonOperator.between:
			return {between: value as [T[P], T[P]]};
		case EComparisonOperator.in:
			return {in: value as T[P][]};
		case EComparisonOperator.like:
			return {like: value as string};
		case EComparisonOperator.greaterThan:
			return {greaterThan: value};
		case EComparisonOperator.greaterThanOrEquals:
			return {greaterThanOrEquals: value};
		case EComparisonOperator.lessThan:
			return {lessThan: value};
		case EComparisonOperator.lessThanOrEquals:
			return {lessThanOrEquals: value};
		case EComparisonOperator.notEquals:
			return {notEquals: value};
		case EComparisonOperator.notBetween:
			return {notBetween: value as [T[P], T[P]]};
		case EComparisonOperator.notIn:
			return {notIn: value as T[P][]};
		case EComparisonOperator.notLike:
			return {notLike: value as string};
		case EComparisonOperator.isNull:
			return {isNull: null};
		case EComparisonOperator.notNull:
			return {notNull: null};
		default:
			throw new Error('Invalid operator');
	}
}
