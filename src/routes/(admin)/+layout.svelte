<script lang="ts">
	import '../../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import Dashboard from '$lib/layouts/Dashboard.svelte';
	import { fly } from 'svelte/transition';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<ModeWatcher />
<Dashboard
	sidebarNavItems={[
		{
			title: 'Dashboard',
			href: '/',
			icon: 'Home',
			highlight: /^\/$/,
		},
		{
			title: 'Anggota Keluarga',
			href: '/anggota-keluarga',
			icon: 'Users',
			highlight: /^\/anggota-keluarga/,
		},
		{
			title: 'Jelajahi Cerita',
			href: '/cerita',
			icon: 'Trophy',
			highlight: /^\/cerita/,
		},
		{
			title: 'Grafik Keturunan',
			href: '/grafik-keturunan',
			icon: 'GitBranch',
			highlight: /^\/grafik-keturunan/,
		},
		{
			title: 'Notifikasi',
			href: '/notifikasi',
			icon: 'Bell',
			highlight: /^\/notifikasi/,
		},
	]}
>
	{#key data.url}
		<div in:fly={{ y: 100, duration: 300, delay: 300 }} out:fly={{ duration: 300 }}>
			<slot />
		</div>
	{/key}
</Dashboard>
