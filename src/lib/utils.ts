import { type ClassValue, clsx } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

import type { Alamat } from './types';

export interface FamilyNode {
	name: string;
	children?: FamilyNode[];
}

export function capitalize(input: string) {
	return input
		.split(' ')
		.map((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase())
		.join(' ');
}

export function joinAlamat(alamat: Alamat) {
	return `${capitalize(alamat.kelurahan)}, ${capitalize(
		alamat.kecamatan,
	)}, ${capitalize(alamat.kabupaten)}, ${capitalize(alamat.provinsi)}`;
}

export function tempatTanggalLahir(alamat: Alamat, date: Date) {
	return `${capitalize(alamat.kelurahan)}/${formatDate(date)}`;
}

export function formatDate(date: Date) {
  // Array nama hari dalam Bahasa Indonesia
  const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  
  // Array nama bulan dalam Bahasa Indonesia
  const months = [
    "Januari", "Februari", "Maret", "April",
    "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember"
  ];

  // Mendapatkan informasi hari, tanggal, bulan, dan tahun
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Membuat string dengan format yang diinginkan
  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;

  return formattedDate;
}

/**
 * Jika hacker mengubah url redirectTo di path dengan url mereka,
 * maka path tersebut akan menjadi tidak valid (Error 404).
 * Karena huruf pertama diganti dengan '/'
 *
 * Contoh:
 * - /home -> /home (Valid)
 * - https://somesite.com/home -> /ttps://somesite.com/home (Error 404)
 *
 * @param path
 * @returns
 */
export function securePath(path: string) {
	return `/${path.substring(1)}`;
}

/**
 * Menggabungkan class dengan twMerge dan clsx.
 * Jadi, cn('a', 'b', 'c') = 'a b c'
 *
 * @param inputs
 * @returns
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number],
	) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t,
			});
		},
		easing: cubicOut,
	};
};
