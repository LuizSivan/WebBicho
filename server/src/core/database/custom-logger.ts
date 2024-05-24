import {format} from 'date-fns';
import {Logger, QueryRunner} from 'typeorm';

export class CustomLogger implements Logger {
  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
    const formattedQuery: string = this.formatQueryWithParameters(query, parameters);
    console.log(`[ ${format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')} ] INFO - ${formattedQuery}`);
  }
  
  logQueryError(error: string, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
    const formattedQuery: string = this.formatQueryWithParameters(query, parameters);
    console.error(`[ ${format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')} ] ERROR - ${formattedQuery} - Error: ${error}`);
  }
  
  logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
    const formattedQuery: string = this.formatQueryWithParameters(query, parameters);
    console.warn(`[ ${format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')} ] WARN - Query is slow: ${time}ms - ${formattedQuery}`);
  }
  
  logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
    console.log(`[ ${format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')} ] INFO - Schema Build: ${message}`);
  }
  
  logMigration(message: string, _queryRunner?: QueryRunner): void {
    console.log(`[ ${format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')} ] INFO - Migration: ${message}`);
  }
  
  log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner): void {
    console.log(`[ ${format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')} ] ${level.toUpperCase()} - ${message}`);
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
            ? `'${param.toISOString()}'`
            : `'${param}'`
      );
    });
    return formattedQuery;
  }
}
