import chalk from 'chalk';
import {format} from 'date-fns';
import {
	Logger,
	QueryRunner
} from 'typeorm';
import process from 'process';


export class CustomLogger implements Logger {
	
	getPrefix(): string {
		const pid: number = process.pid;
		return `${chalk.blue(`[TypeORM] ${pid}  -`)} ${format(new Date(), 'MM/dd/yyyy, hh:mm:ss a')}    `;
	}
	
	logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
		const formattedQuery: string = this.formatQueryWithParameters(query, parameters);
		console.log(`${this.getPrefix()} INFO - ${formattedQuery}`);
	}
	
	logQueryError(error: string, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
		const formattedQuery: string = this.formatQueryWithParameters(query, parameters);
		console.error(`${this.getPrefix()} ERROR - ${formattedQuery} - Error: ${error}`);
	}
	
	logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
		const formattedQuery: string = this.formatQueryWithParameters(query, parameters);
		console.warn(`${this.getPrefix()} WARN - Query is slow: ${time}ms - ${formattedQuery}`);
	}
	
	logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
		console.log(`${this.getPrefix()} INFO - Schema Build: ${message}`);
	}
	
	logMigration(message: string, _queryRunner?: QueryRunner): void {
		console.log(`${this.getPrefix()} INFO - Migration: ${message}`);
	}
	
	log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner): void {
		console.log(`${this.getPrefix()} ${level.toUpperCase()} - ${message}`);
	}
	
	private formatQueryWithParameters(query: string, parameters?: any[]): string {
		if (!parameters || parameters.length === 0) {
			return query;
		}
		let formattedQuery: string = query;
		parameters.forEach((param, index) => {
			const paramPlaceholder: RegExp = new RegExp(`\\$${index + 1}`, 'g');
			formattedQuery = formattedQuery.replace(
					paramPlaceholder,
					param instanceof Date
						? `'${chalk.green(param.toISOString())}'`
						: `'${chalk.green(param)}'`
			);
		});
		return formattedQuery;
	}
}

const reservedWords: string[] = [
	'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'JOIN', 'WHERE',
	'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'AND', 'OR',
	'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL', 'AS',
	'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'DESC', 'ASC'
];


