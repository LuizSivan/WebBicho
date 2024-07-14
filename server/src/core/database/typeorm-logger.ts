import chalk from 'chalk';
import {format} from 'date-fns';
import {
	Logger,
	QueryRunner
} from 'typeorm';
import process from 'process';


export class TypeORMLogger implements Logger {
	
	getPrefix(level: LogLevel): string {
		const pid: number = process.pid;
		let levelColor: string;
		switch (level) {
			case 'ERROR':
				levelColor = chalk.red(level);
				break;
			case 'WARN':
				levelColor = chalk.yellow(level);
				break;
			case 'MIGRATION':
			case 'SCHEMA':
				levelColor = chalk.green(level);
				break;
			default:
				levelColor = chalk.blue(level);
		}
		return `${chalk.blue(`[TypeORM] ${pid} -`)} ${format(new Date(), 'dd/MM/yyyy, HH:mm:ss')} | ${levelColor} |`;
	}
	
	logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
		const formattedQuery: string = this.prepareMessage(query, parameters);
		console.log(`${this.getPrefix('INFO')} ${formattedQuery}`);
	}
	
	logQueryError(error: string, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
		const formattedQuery: string = this.prepareMessage(query, parameters);
		console.error(`${this.getPrefix('ERROR')} Error: ${error} \n${formattedQuery}`);
	}
	
	logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
		const formattedQuery: string = this.prepareMessage(query, parameters);
		console.warn(`${this.getPrefix('WARN')} Query is slow: ${chalk.yellow(`${time}ms`)} - ${formattedQuery}`);
	}
	
	logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
		console.log(`${this.getPrefix('SCHEMA')} ${message}`);
	}
	
	logMigration(message: string, _queryRunner?: QueryRunner): void {
		console.log(`${this.getPrefix('MIGRATION')} ${message}`);
	}
	
	log(_level: 'log' | 'info' | 'warn', _message: any, _queryRunner?: QueryRunner): void {
	}
	
	private prepareMessage(query: string, parameters?: any[]): string {
		query = query.replace(combinedPattern, (match) => {
			if (reservedWords.includes(match.toUpperCase())) {
				return chalk.blue(match);
			} else if (functions.includes(match.toLowerCase())) {
				return chalk.magentaBright(match);
			}
			return match;
		});
		
		query = query.replace(/'(.*?)'/g, (_match, p1) => chalk.dim(`'${p1}'`));
		
		if (!parameters || parameters.length === 0) {
			return query;
		}
		let formattedQuery: string = query;
		parameters.forEach((param, index) => {
			const paramPlaceholder: RegExp = new RegExp(`\\$${index + 1}`, 'g');
			formattedQuery = formattedQuery.replace(
					paramPlaceholder,
					param instanceof Date
						? chalk.green(`'${param.toISOString()}'`)
						: chalk.green(`'${param}'`)
			);
		});
		return formattedQuery;
	}
}

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SCHEMA' | 'MIGRATION';

const reservedWords: string[] = [
	'INSERT', 'INTO', 'RETURNING', 'WITH',
	'SELECT', 'UPDATE', 'DELETE', 'FROM', 'JOIN', 'WHERE',
	'ORDER', 'GROUP', 'BY', 'HAVING', 'LIMIT', 'OFFSET', 'AND', 'OR',
	'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL', 'AS',
	'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'DESC', 'ASC',
	'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
	'START', 'TRANSACTION', 'COMMIT', 'ROLLBACK',
];

const functions: string[] = [
	'unnest', 'unaccent', 'current_schema', 'current_database', 'version', 'current_date',
	'current_time', 'current_timestamp', 'now', 'age'
];

const combinedKeywords: string = [...reservedWords, ...functions].join('|');
const combinedPattern: RegExp = new RegExp(`\\b(${combinedKeywords})\\b`, 'gi');

