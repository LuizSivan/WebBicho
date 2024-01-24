export enum EOperator {
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

export function createParam<T, P extends keyof T>(
		operator: EOperator,
		value: T[P],
): SearchParamType<T, P> {
	switch (operator) {
		case EOperator.equals:
			return {equals: value};
		case EOperator.between:
			return {between: value as [T[P], T[P]]};
		case EOperator.in:
			return {in: value as T[P][]};
		case EOperator.like:
			return {like: value as string};
		case EOperator.greaterThan:
			return {greaterThan: value};
		case EOperator.greaterThanOrEquals:
			return {greaterThanOrEquals: value};
		case EOperator.lessThan:
			return {lessThan: value};
		case EOperator.lessThanOrEquals:
			return {lessThanOrEquals: value};
		case EOperator.notEquals:
			return {notEquals: value};
		case EOperator.notBetween:
			return {notBetween: value as [T[P], T[P]]};
		case EOperator.notIn:
			return {notIn: value as T[P][]};
		case EOperator.notLike:
			return {notLike: value as string};
		case EOperator.isNull:
			return {isNull: null};
		case EOperator.notNull:
			return {notNull: null};
		default:
			throw new Error('Invalid operator');
	}
}
