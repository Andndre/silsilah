<script>
	import '../../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import Dashboard from '$lib/layouts/Dashboard.svelte';
</script>

<ModeWatcher />
<Dashboard
	sidebarNavItems={[
		{
			title: 'Dashboard',
			href: '/',
			icon: 'Home',
			highlight: /^\/$/
		},
		{
			title: 'Anggota Keluarga',
			href: '/anggota-keluarga',
			icon: 'Users',
			highlight: /^\/anggota-keluarga/
		},
		{
			title: 'Jelajahi Cerita',
			href: '/cerita',
			icon: 'Trophy',
			highlight: /^\/cerita/
		},
		{
			title: 'Grafik Keturunan',
			href: '/grafik-keturunan',
			icon: 'GitBranch',
			highlight: /^\/grafik-keturunan/
		},
		{
			title: 'Notifikasi',
			href: '/notifikasi',
			icon: 'Bell',
			highlight: /^\/notifikasi/
		},
	]}
>
	<div class="max-w-[1000px] mx-auto">
		<slot />
	</div>
</Dashboard>
