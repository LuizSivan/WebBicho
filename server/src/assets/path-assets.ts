import path from 'node:path';

interface PathAssets {
	readonly logos: string,
	readonly html: string,
	readonly views: string,
}

export const pathAssets: PathAssets = {
	logos: path.join(__dirname, 'logos'),
	html: path.join(__dirname, 'html'),
	views: path.join(__dirname, 'views'),
};
