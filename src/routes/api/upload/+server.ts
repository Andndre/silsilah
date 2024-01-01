import { API_HOSTING_GAMBAR, API_KEY_HOSTING_GAMBAR } from '$env/static/private';
import { Buffer } from 'buffer';

import sharp from 'sharp';


export const POST = async ({ request, fetch }) => {
	const formData = await request.formData();
	const formFile = formData.get('file') as File;

	const result = await sharp(await formFile.arrayBuffer())
		.webp({ quality: 20 })
		.toBuffer();
	const base64Image = Buffer.from(result).toString('base64');
	const formDataSend = new FormData();

	formDataSend.append("key", API_KEY_HOSTING_GAMBAR)
	formDataSend.append("source", base64Image);
	
	const response = await fetch(API_HOSTING_GAMBAR, {
		method: 'POST',
		body: formDataSend,
	});

	if (!response.ok) {
		return new Response(response.statusText, { status: response.status });
	}

	const json = await response.json();
	return new Response(JSON.stringify({ url: json.image.url }));
};
