import cors from 'cors';
import express, { Express } from 'express';
import routes from './routes/routes';
import { appDataSource, DEFAULT_DB, getRepository, Maintenance } from './database/datasource';
import dotenv from 'dotenv';
import { scheduleJob } from 'node-schedule';
import { LessThan, Repository } from 'typeorm';
import { User } from './models/entities/User';

dotenv.config();

export const HOST: string = process.env.HOST || 'http://127.0.0.1';
const PORT: string | number = process.env.PORT || 8070;
const app: Express = express();

app.use(express.json({limit: '10mb'}));
app.use(cors());

app.use('/', routes);

Maintenance.initialize().then((): void => {
	inicializa().then((): void => {
		app.listen(PORT, (): void => {
			console.log(
					'⣇⣿⠘⣿⣿⣿⡿⡿⣟⣟⢟⢟⢝⠵⡝⣿⡿⢂⣼⣿⣷⣌⠩⡫⡻⣝⠹⢿⣿⣷\n' +
					'⡆⣿⣆⠱⣝⡵⣝⢅⠙⣿⢕⢕⢕⢕⢝⣥⢒⠅⣿⣿⣿⡿⣳⣌⠪⡪⣡⢑⢝⣇\n' +
					'⡆⣿⣿⣦⠹⣳⣳⣕⢅⠈⢗⢕⢕⢕⢕⢕⢈⢆⠟⠋⠉⠁⠉⠉⠁⠈⠼⢐⢕⢽\n' +
					'⡗⢰⣶⣶⣦⣝⢝⢕⢕⠅⡆⢕⢕⢕⢕⢕⣴⠏⣠⡶⠛⡉⡉⡛⢶⣦⡀⠐⣕⢕\n' +
					'⡝⡄⢻⢟⣿⣿⣷⣕⣕⣅⣿⣔⣕⣵⣵⣿⣿⢠⣿⢠⣮⡈⣌⠨⠅⠹⣷⡀⢱⢕\n' +
					'⡝⡵⠟⠈⢀⣀⣀⡀⠉⢿⣿⣿⣿⣿⣿⣿⣿⣼⣿⢈⡋⠴⢿⡟⣡⡇⣿⡇⡀⢕\n' +
					'⡝⠁⣠⣾⠟⡉⡉⡉⠻⣦⣻⣿⣿⣿⣿⣿⣿⣿⣿⣧⠸⣿⣦⣥⣿⡇⡿⣰⢗⢄\n' +
					'⠁⢰⣿⡏⣴⣌⠈⣌⠡⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣬⣉⣉⣁⣄⢖⢕⢕⢕\n' +
					'⡀⢻⣿⡇⢙⠁⠴⢿⡟⣡⡆⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣵⣵⣿\n' +
					'⡻⣄⣻⣿⣌⠘⢿⣷⣥⣿⠇⣿⣿⣿⣿⣿⣿⠛⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n' +
					'⣷⢄⠻⣿⣟⠿⠦⠍⠉⣡⣾⣿⣿⣿⣿⣿⣿⢸⣿⣦⠙⣿⣿⣿⣿⣿⣿⣿⣿⠟\n' +
					'⡕⡑⣑⣈⣻⢗⢟⢞⢝⣻⣿⣿⣿⣿⣿⣿⣿⠸⣿⠿⠃⣿⣿⣿⣿⣿⣿⡿⠁⣠\n' +
					'⡝⡵⡈⢟⢕⢕⢕⢕⣵⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣿⣿⣿⣿⣿⠿⠋⣀⣈⠙\n' +
					'⡝⡵⡕⡀⠑⠳⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢉⡠⡲⡫⡪⡪⡣\n\n'
			);
			console.log(`Servidor rodando com sucesso em ${HOST}:${PORT}`);
			scheduleJob('0 0 * * *', async (): Promise<void> => {
				await deleteUnverifiedUsers();
			});
		});
	});
});

async function deleteUnverifiedUsers(): Promise<void> {
	const repository: Repository<User> = getRepository(User);
	const cutoffTime: Date = new Date(Date.now() - 15 * 60 * 1000);
	await repository.delete({
		verified: false,
		createdAt: LessThan(cutoffTime),
	});
}

async function inicializa(): Promise<void> {
	try {
		await Maintenance.query(`CREATE DATABASE ${DEFAULT_DB};`);
	} catch (e) {
	}
	try {
		await appDataSource.initialize();
	} catch (e) {
	}
	try {
		await appDataSource.query(`CREATE EXTENSION if not exists unaccent;`);
	} catch (e) {
	}
}
