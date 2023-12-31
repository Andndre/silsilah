import { z } from 'zod';

export const formSchema = z.object({
	suami_nama: z.string().min(1, 'Inputkan Nama Lengkap Suami'),
	suami_ref_key: z.string().nullable(),
	istri_nama: z.string().min(1, 'Inputkan Nama Lengkap Istri'),
	istri_ref_key: z.string().nullable(),
	suami_tempat_lahir: z.string().min(1, 'Inputkan Tempat Lahir Suami'),
	istri_tempat_lahir: z.string().min(1, 'Inputkan Tempat Lahir Istri'),
	suami_tanggal_lahir: z.string().min(1, 'Inputkan Tanggal Lahir Suami'),
	istri_tanggal_lahir: z.string().min(1, 'Inputkan Tanggal Lahir Istri'),
	suami_agama: z.number({ required_error: 'Agama harus diisi' }),
	istri_agama: z.number({ required_error: 'Agama harus diisi' }),
	tanggal_menikah: z.string().min(1, 'Inputkan Tanggal Menikah'),
	alamat_tinggal: z.string().min(1, 'Inputkan Alamat Tinggal'),
	marga: z.number({ required_error: 'Marga harus diisi' }),
	username: z.string().min(1, 'Inputkan Username'),
	password: z.string().min(1, 'Inputkan Password'),
	password_konfirmasi: z.string().min(1, 'Inputkan Konfirmasi Password'),
});

export type FormSchema = typeof formSchema;
