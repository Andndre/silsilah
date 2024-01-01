import { agama } from '../schema';
import { db } from './database';

db.insert(agama).values([
	{
		nama: 'Islam',
	},
	{
		nama: 'Kristen',
	},
	{
		nama: 'Hindu',
	},
	{
		nama: 'Buddha',
	},
	{
		nama: 'Konghucu',
	},
	{
		nama: 'Katolik',
	},
]);
