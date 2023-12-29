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
			icon: 'Home'
		},
		{
			title: 'Anggota Keluarga',
			href: '/anggota-keluarga',
			icon: 'Users'
		},
		{
			title: 'Data Pencapaian',
			href: '/data-pencapaian',
			icon: 'Trophy'
		},
		{
			title: 'Notifikasi',
			href: '/notifikasi',
			icon: 'Bell'
		}
	]}
>
	<slot />
</Dashboard>
