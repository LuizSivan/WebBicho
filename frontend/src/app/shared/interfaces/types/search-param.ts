export type SearchParam<T> = {
	[P in keyof T]?: P extends 'toString' ? unknown : T[P] | any
}

/*export type SearchParam<T> = {
	[P in keyof T]?: SingleSearchParam<T[P]> | SingleSearchParam<T[P]>[];
};

type SingleSearchParam<T> =
		| T
		| { between: [T, T] }
		| { in: T[] }
		| { not: SingleSearchParam<T> }
		| { like: string };*/
