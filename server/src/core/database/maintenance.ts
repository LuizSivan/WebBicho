import {Client, QueryResult} from 'pg';
import * as process from 'process';
import dotenv from 'dotenv';

dotenv.config();
export const DEFAULT_DB: string = 'webbicho';

export async function createDatabaseIfNotExist(): Promise<void> {
  const client: Client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres'
  });
  
  try {
    await client.connect();
    const databaseExists: boolean = await checkDatabaseExists(client);
    if (!databaseExists) {
      await createDatabase(client);
      await createUnaccentExtension();
    }
  } catch (e: any) {
    console.log(`Erro na verificação do banco de dados: ${e.message}`);
  } finally {
    await client.end();
  }
}

async function checkDatabaseExists(client: Client): Promise<boolean> {
  const res: QueryResult = await client.query(`SELECT datname
                                               FROM pg_catalog.pg_database
                                               WHERE lower(datname) = lower('${DEFAULT_DB}')`);
  return res.rows.length > 0;
}

async function createDatabase(client: Client): Promise<void> {
  try {
    await client.query(`CREATE DATABASE ${DEFAULT_DB}`);
  } catch (e: any) {
    console.log(`Erro ao criar banco de dados ${client.database}: ${e.message}`);
  }
}

async function createUnaccentExtension(): Promise<void> {
  const client: Client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: DEFAULT_DB,
  });
  try {
    await client.connect();
    await client.query('CREATE EXTENSION IF NOT EXISTS unaccent');
  } catch (e: any) {
    console.log(`Erro ao criar EXTENSION unaccent: ${e.message}`);
  } finally {
    await client.end();
  }
}
