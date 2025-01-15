import chalk, {Color} from 'chalk';
import {
	Logger,
	LogLevel as LogLevelTypeOrm,
	QueryRunner
} from 'typeorm';
import process from 'process';
import {PlatformTools} from 'typeorm/platform/PlatformTools';

export interface TypeORMLoggerOptions {
	logging: boolean | LogLevelTypeOrm[];
}


export class TypeORMLogger implements Logger {
	
	constructor(
			private readonly options?: TypeORMLoggerOptions,
	) {
		if (options && options.logging == undefined) {
			options.logging = true;
		}
	}
	
	get logging(): boolean | LogLevelTypeOrm[] {
		return this.options.logging;
	}
	
	getPrefix(level: LogLevel): string {
		const locale: string = Intl.DateTimeFormat().resolvedOptions().locale || 'default';
		const formattedDate: string = new Intl
				.DateTimeFormat(locale, {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
				})
				.format(new Date());
		let color: typeof Color = 'blue';
		switch (level) {
			case 'ERROR':
				color = 'red';
				break;
			case 'WARN':
				color = 'yellow';
				break;
			case 'MIGRATION':
			case 'SCHEMA':
				color = 'green';
				break;
		}
		const pid: string = process.pid
				.toString()
				.padEnd(6, ' ');
		const logLevel: string = chalk[color](level.padStart(9, ' '));
		return `${chalk.blue(`[TypeORM] ${pid} -`)} ${formattedDate} ${chalk.bold(logLevel)}:`;
	}
	
	logQuery(query: string, parameters?: never[], _queryRunner?: QueryRunner): void {
		if (this.logging instanceof Boolean && !this.logging) return;
		if (this.logging instanceof Array && !this.logging.includes('info')) return;
		const formattedQuery: string = this.prepareMessage(query, parameters);
		console.log(`${this.getPrefix('INFO')} ${formattedQuery}`);
	}
	
	logQueryError(error: string, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
		if (this.logging instanceof Boolean && !this.logging) return;
		if (this.logging instanceof Array && !this.logging.includes('error')) return;
		const formattedQuery: string = this.prepareMessage(query, parameters);
		console.error(`${this.getPrefix('ERROR')} Error: ${error} \n${formattedQuery}`);
	}
	
	logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
		if (this.logging instanceof Boolean && !this.logging) return;
		if (this.logging instanceof Array && !this.logging.includes('warn')) return;
		const formattedQuery: string = this.prepareMessage(query, parameters);
		console.warn(`${this.getPrefix('WARN')} Query is slow: ${chalk.yellow(`${time}ms`)} - ${formattedQuery}`);
	}
	
	logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
		if (this.logging instanceof Boolean && !this.logging) return;
		if (this.logging instanceof Array && !this.logging.includes('schema')) return;
		console.log(`${this.getPrefix('SCHEMA')} ${message}`);
	}
	
	logMigration(message: string, _queryRunner?: QueryRunner): void {
		if (this.logging instanceof Boolean && !this.logging) return;
		if (this.logging instanceof Array && !this.logging.includes('migration')) return;
		console.log(`${this.getPrefix('MIGRATION')} ${message}`);
	}
	
	log(_level: 'log' | 'info' | 'warn', _message: any, _queryRunner?: QueryRunner): void {
	}
	
	private prepareMessage(query: string, parameters?: any[]): string {
		if (!parameters || parameters.length === 0) {
			return PlatformTools.highlightSql(query);
		}
		let formattedQuery: string = query;
		parameters.forEach((param: any, index: number) => {
			formattedQuery = this.replaceFormattedParam(
					formattedQuery,
					param,
					index,
			);
		});
		return PlatformTools.highlightSql(query);
	}
	
	private replaceFormattedParam(query: string, param: any, index: number): string {
		const placeholder: RegExp = new RegExp(`\\$${index + 1}(?!\\d)`, 'g');
		switch (typeof param) {
			case 'object':
				return query.replace(placeholder, `'${param?.toString()}'`);
			case 'string':
				return query.replace(placeholder, `'${param}'`);
			default:
				return query.replace(placeholder, param);
		}
	}
}

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SCHEMA' | 'MIGRATION';
