import { JenisKelamin } from '$lib/types';
import { z } from 'zod';

export const formSchema = z.object({
	name: z.string().min(1, { message: 'Tidak boleh kosong' }),
	jenis_kelamin: z.nativeEnum(JenisKelamin),
	tempat_lahir: z.string().min(1, { message: 'Inputkan Tempat Lahir' }),
	tanggal_lahir: z.string().min(1, { message: 'Inputkan Tanggal Lahir' }),
	agama: z.number({ required_error: 'Inputkan Agama' }),
	image: z.string().optional(),
});

export type FormSchema = typeof formSchema;
