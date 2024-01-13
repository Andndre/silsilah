import { type Anggota, keluarga } from '$lib/schema.js';
import { db } from '$lib/server/database.js';
import { unauthorized } from '$lib/server/responses.js';
import type { RecursiveTrue } from '$lib/types';
import { eq } from 'drizzle-orm';

export type Child = Omit<Anggota, 'agama'> &
	(
		| { status: 'BM'; jenisKelamin: 'L' }
		| { status: 'M'; jenisKelamin: 'P' }
		| { status: 'BM'; jenisKelamin: 'P' }
	);

export type Parent = Omit<Anggota, 'agama' | 'jenisKelamin' | 'status'>;

export type FamilyTreeSchema = {
	ayah: Parent;
	ibu: Parent;
	id: number;
	anakAnak: (Child | FamilyTreeSchema | {})[];
};

export const GET = async ({ locals }) => {
	if (!locals.user) {
		return unauthorized();
	}

	const user = locals.user;
	const res = await db.transaction(async (tx) => {
		const schema: FamilyTreeSchema | {} = {};
		async function recursive(
			idAkun: number,
			result: FamilyTreeSchema,
		): Promise<FamilyTreeSchema> {
			const query = await tx.query.keluarga.findFirst({
				where: () => eq(keluarga.id, idAkun),
				columns: {
					id: true,
					tanggal_menikah: true,
				},
				with: {
					suami_: {
						columns: {
							nama: true,
							tanggalLahir: true,
							tanggalMeninggal: true,
							id: true,
							refKey: true,
							gambar: true,
							tempatLahir: true,
							keluargaAsal: true,
						} satisfies RecursiveTrue<Parent>,
					},
					istri_: {
						columns: {
							nama: true,
							tanggalLahir: true,
							tanggalMeninggal: true,
							id: true,
							refKey: true,
							gambar: true,
							tempatLahir: true,
							keluargaAsal: true,
						} satisfies RecursiveTrue<Parent>,
					},
					anggotaKeluarga: {
						columns: {
							id: true,
							status: true,
							jenisKelamin: true,
							refKey: true,
							nama: true,
							tempatLahir: true,
							tanggalLahir: true,
							tanggalMeninggal: true,
							keluargaAsal: true,
							gambar: true,
						} satisfies RecursiveTrue<Child>,
					},
				},
			});
			if (!query) return result;
			result.ayah = query.suami_;
			result.ibu = query.istri_;
			result.anakAnak = [];
			result.id = idAkun;
			for (let i = 0; i < query.anggotaKeluarga.length; i++) {
				const anak = query.anggotaKeluarga[i];
				if (anak.status === 'BM' || anak.jenisKelamin === 'P') {
					result.anakAnak[i] = anak as Child;
				} else {
					const queryAsalKeluarga = await tx.query.keluarga.findFirst({
						where: () => eq(keluarga.suami, anak.id),
						columns: {
							id: true,
						},
					});
					if (!queryAsalKeluarga) return result;
					const { id: idKeluarga } = queryAsalKeluarga;
					result.anakAnak[i] = {};
					result.anakAnak[i] = await recursive(
						idKeluarga,
						result.anakAnak[i] as FamilyTreeSchema,
					);
				}
			}
			return result;
		}

		return await recursive(user.id, schema as FamilyTreeSchema);
	});
	return new Response(JSON.stringify(res));
};
