import { z } from 'zod';

export const formSchema = z.object({
	name: z.string().nullable(),
	jenis_kelamin: z.enum(['L', 'P']).nullable(),
	tempat_lahir: z.string().nullable(),
	tanggal_lahir: z.string().nullable(),
	has_ref_key: z.boolean(),
	ref_key: z.string().nullable(),
});

export type FormSchema = typeof formSchema;
