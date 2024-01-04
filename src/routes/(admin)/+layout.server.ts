import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Check if the user is not logged in
	if (!locals.user) {
		// Redirect the user to the login page with the current URL as a redirect parameter
		throw redirect(303, '/login?redirect=' + url.pathname);
	}

	// Return an empty object
	return {
		url: url.pathname,
	};
};
