// See https://kit.svelte.dev/docs/types#app
import type { keluarga } from '$lib/schema';
import type { InferSelectModel } from 'drizzle-orm';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			user: {
				id: number;
				marga: number;
				username: string;
				suami: number;
				istri: number;
				alamat: string;
				tanggal_menikah: Date;
				password: string;
				refreshSession: string;
			} | null;
		}
	}
}

export {};
