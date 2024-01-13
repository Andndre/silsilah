export const unauthorized = () =>
	new Response(
		JSON.stringify({
			message: 'Unauthorized',
		}),
		{
			status: 403,
		},
	);
