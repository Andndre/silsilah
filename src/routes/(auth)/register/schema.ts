import { z } from 'zod';

export const formSchema = z.object({
	no_kk: z.string().length(16, 'Nomor KK umumnya memiliki panjang 16 digit'),
	nik: z.string().length(16, 'Nomor Induk Kependudukan umumnya memiliki panjang 16 digit'),
	turunan_kk: z.string().length(16, 'Nomor KK umumnya memiliki panjang 16 digit').nullable(),
	id_marga: z.string().nullable(),
	nama_kepala_keluarga: z.string().min(1, 'Wajib diisi'),
	status: z.enum(['suami', 'istri']),
	agama: z.string().max(10),
	tanggal_lahir: z.string(),
	is_turunan: z.boolean().default(false)
});

export type FormSchema = typeof formSchema;
