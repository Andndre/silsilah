import { browser } from '$app/environment';

export async function getKelurahanClient(kelurahanId: string) {
	if (browser) {
		const responseAlamat = await fetch(`/api/lokasi/kelurahan/satu/${kelurahanId}`);
		return (await responseAlamat.json()).name as string;
	}
	return null;
}

export async function refreshKey(id: number) {
	if (browser) {
		const responseKey = await fetch('/api/ref-key?id=' + id);
		return (await responseKey.json()).newRefKey as string;
	}
	return null;
}
