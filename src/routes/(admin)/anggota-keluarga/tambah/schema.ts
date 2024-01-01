import { z } from 'zod';

export const formSchema = z.object({
	name: z.string().min(1, 'Inputkan Nama'),
	jenis_kelamin: z.enum(['L', 'P'], { required_error: 'Inputkan Jenis Kelamin' }),
	tempat_lahir: z.string().min(1, 'Inputkan Tempat Lahir'),
	tanggal_lahir: z.string().min(1, 'Inputkan Tanggal Lahir'),
});

export type FormSchema = typeof formSchema;
