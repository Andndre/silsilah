import { API_LOKASI_INDONESIA } from '$env/static/private';

export async function GET({ setHeaders, params }) {
	const test = await fetch(`${API_LOKASI_INDONESIA}/regencies/${params.id}.json`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	return new Response(JSON.stringify(await test.json()), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'cache-control': 'public, max-age=60'
		}
	});
}
