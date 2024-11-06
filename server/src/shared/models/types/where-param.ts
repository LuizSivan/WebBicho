type SqlPrefix =
    | ''
    | 'notEquals-'
    | 'between-'
    | 'notBetween-'
    | 'in-'
    | 'notIn-'
    | 'like-'
    | 'notLike-'
    | 'greaterThan-'
    | 'greaterThanOrEquals-'
    | 'lessThan-'
    | 'lessThanOrEquals-'
    | 'isNull-'
    | 'notNull-';

export type WhereParam<T> = {
	[P in keyof T as `${SqlPrefix}${string & P}`]?:
    | T[P]
    | T[P][]
    | WhereParam<T[P]>;
};
