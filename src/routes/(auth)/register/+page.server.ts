import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import { db } from '$lib/server/database';
import { agama, keluarga, marga, anggota } from '$lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt'

export const load: PageServerLoad = async () => {
	const allAgama = await db.select().from(agama);

	return {
		form: await superValidate(formSchema),
		allAgama
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (form.data.password !== form.data.password_konfirmasi) {
			form.errors.password_konfirmasi = ['Password tidak sama'];
			return fail(400, {
				form,
				message: 'Password tidak sama'
			});
		}

		try {
			await db.transaction(async (tx) => {
				// AYAH
				let idAyah: number = -1
				if (form.data.suami_ref_key) {
					const result = await tx.select().from(anggota).where(eq(anggota.refKey, form.data.suami_ref_key));
					if (result.length > 0) {
						idAyah = result[0].id;
					} else {
						return fail(400, {
							form,
							message: 'Data ayah tidak ditemukan'
						});
					}
				} else {
					[{ insertId: idAyah }] = await tx.insert(anggota).values({
						agama: form.data.suami_agama,
						nama: form.data.suami_nama,
						tempatLahir: form.data.suami_tempat_lahir,
						tanggalLahir: new Date(form.data.suami_tanggal_lahir),
						jenisKelamin: 'L'
					});
				}

				// IBU
				let idIbu: number = -1
				if (form.data.istri_ref_key) {
					const result = await tx
						.select()
						.from(anggota)
						.where(eq(anggota.refKey, form.data.istri_ref_key));
					if (result.length > 0) {
						idIbu = result[0].id;
					} else {
						return fail(400, {
							form,
							message: 'Data ibu tidak ditemukan'
						});
					}
				} else {
					[{ insertId: idIbu }] = await tx.insert(anggota).values({
						agama: form.data.istri_agama,
						nama: form.data.istri_nama,
						tempatLahir: form.data.istri_tempat_lahir,
						tanggalLahir: new Date(form.data.istri_tanggal_lahir),
						jenisKelamin: 'P'
					});
				}
				const [{ insertId: idKeluarga }] = await tx.insert(keluarga).values({
					password: await bcrypt.hash(form.data.password, 10),
					suami: idAyah,
					istri: idIbu,
					alamat: form.data.alamat_tinggal,
					marga: form.data.marga,
					tanggal_menikah: new Date(form.data.tanggal_menikah),
					username: form.data.username
				});
				event.cookies.set('session', `${idKeluarga}`, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: true
				});
			});
			return Response.redirect('/', 302);
		} catch (err) {
			console.log(err);
			return fail(500, {
				message: 'Terjadi kesalahan',
				form
			})
		}
		return fail(400, {
			message: 'Terjadi kesalahan',
			form
		});
	}
};
