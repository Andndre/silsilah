import { agama, anggota, keluarga, marga } from '$lib/schema';
import { db } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { and, eq, or } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms/server';
import { v4 } from 'uuid';

import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

/**
 * Loads data for the page server-side rendering.
 * Retrieves the list of allAgama from the database and validates the form.
 */
export const load: PageServerLoad = async ({ locals }) => {
	// Check if locals.user exists
	if (locals.user) {
		// If it does, redirect to the home page with a 303 status code
		throw redirect(303, '/');
	}

	// Retrieve all records from the 'agama' table in the database
	const allAgama = await db.select().from(agama);

	// Perform form validation using the 'formSchema' schema
	const form = await superValidate(formSchema);

	// Return the validated form and the retrieved 'agama' records
	return {
		form,
		allAgama,
	};
};

/**
 * Defines actions for the page.
 * Handles the default action when a form is submitted.
 */
export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);

		// // If the form is not valid, return an error response
		// if (!form.valid) {
		// 	return fail(400, {
		// 		form,
		// 	});
		// }

		let error = '';
		let margaAsal: number | undefined = undefined;

		try {
			await db.transaction(async (tx) => {
				// AYAH
				let idAyah: number = -1;
				// Check if suami_ref_key exists in form data
				if (form.data.suami_has_ref_key != undefined && form.data.suami_has_ref_key) {
					// Find the anggota with matching refKey
					const result = await tx.query.anggota.findFirst({
						where: () => and(eq(anggota.refKey, form.data.suami_ref_key!), eq(anggota.jenisKelamin, 'L')),
						columns: { id: true },
						with: {
							keluargaAsal: {
								columns: {
									marga: true
								}
							}
						}
					});

					// If a matching anggota is found
					if (result) {
						idAyah = result.id; // Set idAyah to the found anggota's id
						margaAsal = result.keluargaAsal?.marga;
					} else {
						// If no matching anggota is found, return an error
						error = 'Data ayah tidak ditemukan';
						return;
					}
				} else {
					if (
						!form.data.suami_agama ||
						!form.data.suami_nama ||
						!form.data.suami_tempat_lahir ||
						!form.data.suami_tanggal_lahir
					) {
						error = 'Data ayah tidak lengkap';
						return;
					}

					// Insert new data for ayah
					[{ insertId: idAyah }] = await tx.insert(anggota).values({
						agama: form.data.suami_agama,
						nama: form.data.suami_nama,
						tempatLahir: form.data.suami_tempat_lahir,
						tanggalLahir: new Date(form.data.suami_tanggal_lahir),
						jenisKelamin: 'L',
						refKey: v4(),
						status: 'M',
					});
				}

				// IBU
				let idIbu: number = -1;
				if (form.data.istri_has_ref_key != undefined && form.data.istri_has_ref_key) {
					// Find the anggota record with matching refKey
					const result = await tx.query.anggota.findFirst({
						where: () => and(eq(anggota.refKey, form.data.istri_ref_key!), eq(anggota.jenisKelamin, 'P')),
						columns: { id: true },
					});

					if (result) {
						// If a matching record is found, assign its id to idIbu
						idIbu = result.id;
					} else {
						// If no matching record is found, return an error message
						error = 'Data ibu tidak ditemukan';
						return;
					}
				} else {
					if (
						!form.data.istri_agama ||
						!form.data.istri_tempat_lahir ||
						!form.data.istri_tanggal_lahir ||
						!form.data.istri_nama
					) {
						error = 'Data ibu tidak lengkap #istri_agama|istri_tempat_lahir|istri_tanggal_lahir|istri_nama';
						return;
					}

					// Insert new data for ibu
					[{ insertId: idIbu }] = await tx.insert(anggota).values({
						agama: form.data.istri_agama,
						nama: form.data.istri_nama,
						tempatLahir: form.data.istri_tempat_lahir,
						tanggalLahir: new Date(form.data.istri_tanggal_lahir),
						jenisKelamin: 'P',
						refKey: v4(),
						status: 'M',
					});
				}

				if (
					!form.data.alamat_tinggal ||
					!form.data.tanggal_menikah ||
					!form.data.username ||
					!form.data.password ||
					!form.data.password_konfirmasi
				) {
					error = 'Data keluarga tidak lengkap #alamat|tanggal_menikah|username|password|password_konfirmasi';
					return;
				}

				if (!form.data.suami_has_ref_key && !form.data.marga) {
					error = 'Data keluarga tidak lengkap #marga';
					return;
				}

				if (form.data.password !== form.data.password_konfirmasi) {
					error = 'Password tidak sama';
					return;
				}

				// Insert data for keluarga
				await tx.insert(keluarga).values({
					password: await bcrypt.hash(form.data.password, 10),
					suami: idAyah,
					istri: idIbu,
					alamat: form.data.alamat_tinggal,
					marga: margaAsal || form.data.marga!,
					tanggal_menikah: new Date(form.data.tanggal_menikah),
					username: form.data.username,
					refreshSession: v4(),
				});

				await tx.update(anggota).set({
					status: 'M',
				}).where(or(eq(anggota.id, idAyah), eq(anggota.id, idIbu)));

			});

			if (error) {
				// Return an error response if an error occurs
				return message(form, error);
			}
		} catch (err) {
			// TODO: delete data anggota baru
			console.error(err);
			// Return an error response if an error occurs
			return fail(500, {
				message: 'Terjadi kesalahan',
				form,
			});
		}

		redirect(302, '/login?redirect=/');
	},
};
