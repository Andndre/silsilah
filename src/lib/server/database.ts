import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import {
	DATABASE_HOST,
	DATABASE_PASSWORD,
	DATABASE_NAME,
	DATABASE_USERNAME
} from '$env/static/private';

const connection = await mysql.createConnection({
	host: DATABASE_HOST,
	user: DATABASE_USERNAME,
	database: DATABASE_NAME,
	password: DATABASE_PASSWORD,
	port: 3306
});

export const db = drizzle(connection);
