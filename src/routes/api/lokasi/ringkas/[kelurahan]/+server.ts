import { API_LOKASI_INDONESIA } from '$env/static/private';
import type { Kabupaten, Kecamatan, Kelurahan, Provinsi } from '$lib/types';

export async function GET({ params }) {
	const kelurahan = (await (
		await fetch(`${API_LOKASI_INDONESIA}/village/${params.kelurahan}.json`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
	).json()) as Kelurahan;

	const kecamatan = (await (
		await fetch(`${API_LOKASI_INDONESIA}/district/${kelurahan.district_id}.json`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
	).json()) as Kecamatan;

	const kabupaten = (await (
		await fetch(`${API_LOKASI_INDONESIA}/regency/${kecamatan.regency_id}.json`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
	).json()) as Kabupaten;

	const provinsi = (await (
		await fetch(`${API_LOKASI_INDONESIA}/province/${kabupaten.province_id}.json`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
	).json()) as Provinsi;

	return new Response(
		JSON.stringify({
			kelurahan: kelurahan.name,
			kecamatan: kecamatan.name,
			kabupaten: kabupaten.name,
			provinsi: provinsi.name,
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'cache-control': 'public, max-age=60',
			},
		},
	);
}
