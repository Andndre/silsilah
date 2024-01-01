import { API_HOSTING_GAMBAR, API_KEY_HOSTING_GAMBAR } from '$env/static/private';
import { Buffer } from 'buffer';
import sharp from 'sharp';

export const POST = async ({ request, fetch }) => {
	// Get the form data from the request
	const formData = await request.formData();
	const formFile = formData.get('file') as File;

	// Convert the file to webp format with a quality of 20
	const result = await sharp(await formFile.arrayBuffer())
		.webp({ quality: 20 })
		.toBuffer();

	// Convert the result to base64 encoding
	const base64Image = Buffer.from(result).toString('base64');

	// Create a new FormData object to send the image data
	const formDataSend = new FormData();
	formDataSend.append('key', API_KEY_HOSTING_GAMBAR);
	formDataSend.append('source', base64Image);

	// Send the image data to the hosting service
	const response = await fetch(API_HOSTING_GAMBAR, {
		method: 'POST',
		body: formDataSend,
	});

	// Check if the response is not OK and return an error response
	if (!response.ok) {
		return new Response(response.statusText, { status: response.status });
	}

	// Parse the response JSON and return the URL of the uploaded image
	const json = await response.json();
	return new Response(JSON.stringify({ url: json.image.url }));
};
