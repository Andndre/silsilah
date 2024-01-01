import { z } from 'zod';

export const formSchema = z.object({
	suami_nama: z.string().nullable(),
	suami_has_ref_key: z.boolean().optional(),
	suami_ref_key: z.string().nullable(),
	istri_nama: z.string().nullable(),
	istri_has_ref_key: z.boolean().optional(),
	istri_ref_key: z.string().nullable(),
	suami_tempat_lahir: z.string().nullable(),
	istri_tempat_lahir: z.string().nullable(),
	suami_tanggal_lahir: z.string().nullable(),
	istri_tanggal_lahir: z.string().nullable(),
	suami_agama: z.number().nullable(),
	istri_agama: z.number().nullable(),
	tanggal_menikah: z.string().nullable(),
	alamat_tinggal: z.string().nullable(),
	marga: z.number().nullable(),
	username: z.string().nullable(),
	password: z.string().nullable(),
	password_konfirmasi: z.string().nullable(),
});

export type FormSchema = typeof formSchema;
