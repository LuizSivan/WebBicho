export type WhereParam<T> = {
	[P in keyof T]?:
    | WhereKey<T[P]>
    | WhereParam<T[P]>
};

export type WhereKey<T> =
    | { equals?: T }
    | { between?: [T, T] }
    | { in?: T[] }
    | { like?: string }
    | { greaterThan?: T }
    | { greaterThanOrEquals?: T }
    | { lessThan?: T }
    | { lessThanOrEquals?: T }
    | { notEquals?: T }
    | { notBetween?: [T, T] }
    | { notIn?: T[] }
    | { notLike?: string }
    | { isNull?: null }
    | { notNull?: null };
