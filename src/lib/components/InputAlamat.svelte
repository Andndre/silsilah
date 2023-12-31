<script lang="ts">
	import { onMount } from 'svelte';
	import * as Tabs from './ui/tabs';
	import Input from './ui/input/input.svelte';

	let className: string = '';
	export { className as class };

	let provinsi = '';
	let provinsiId = '';
	let kabupaten = '';
	let kabupatenId = '';
	let kecamatan = '';
	let kecamatanId = '';
	let kelurahan = '';
	let kelurahanId = '';

	let activeTab = 'provinsi';

	let searching = false;

	export let alamat: string;

	let focus = false;

	interface DataLokasi {
		id: string;
		name: string;
	}

	let allProvinces: DataLokasi[] = [];
	let allKabupaten: DataLokasi[] = [];
	let allKecamatan: DataLokasi[] = [];
	let allKelurahan: DataLokasi[] = [];

	async function getAllProvinces() {
		focus = false;
		activeTab = 'provinsi';
		searching = true;
		const res = await fetch('/api/lokasi/provinsi');
		searching = false;
		if (res.ok) {
			allProvinces = (await res.json()) as DataLokasi[];
		}
	}

	async function getAllKabupaten() {
		if (!provinsi) return;
		focus = false;
		activeTab = 'kabupaten';
		searching = true;
		const res = await fetch(`/api/lokasi/kabupaten/${provinsiId}`);
		searching = false;
		if (res.ok) {
			allKabupaten = (await res.json()) as DataLokasi[];
		}
	}

	async function getAllKecamatan() {
		if (!kabupaten) return;
		focus = false;
		activeTab = 'kecamatan';
		searching = true;
		const res = await fetch(`/api/lokasi/kecamatan/${kabupatenId}`);
		searching = false;
		if (res.ok) {
			allKecamatan = (await res.json()) as DataLokasi[];
		}
	}

	async function getAllKelurahan() {
		if (!kecamatan) return;
		focus = false;
		activeTab = 'kelurahan';
		searching = true;
		const res = await fetch(`/api/lokasi/kelurahan/${kecamatanId}`);
		searching = false;
		if (res.ok) {
			allKelurahan = (await res.json()) as DataLokasi[];
		}
	}

	onMount(() => {
		getAllProvinces();
	});
</script>

<Tabs.Root bind:value={activeTab} class={className}>
	<Tabs.List>
		<Tabs.Trigger
			value="provinsi"
			on:click={() => {
				kabupaten = '';
				kabupatenId = '';
				kecamatan = '';
				kecamatanId = '';
				kelurahan = '';
				kelurahanId = '';
			}}>Provinsi</Tabs.Trigger
		>
		<Tabs.Trigger
			value="kabupaten"
			on:click={() => {
				kecamatan = '';
				kecamatanId = '';
				kelurahan = '';
				kelurahanId = '';
			}}>Kabupaten</Tabs.Trigger
		>
		<Tabs.Trigger
			value="kecamatan"
			on:click={() => {
				kelurahan = '';
				kelurahanId = '';
			}}>Kecamatan</Tabs.Trigger
		>
		<Tabs.Trigger value="kelurahan">Kelurahan</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="provinsi" class="relative">
		<Input
			placeholder="Provinsi"
			name="provinsi"
			bind:value={provinsi}
			on:focus={() => (focus = true)}
		/>
		{#if focus}
			<ul class="absolute w-full bg-background border rounded-md overflow-hidden z-[9999]">
				{#if !searching}
					{#each allProvinces as province}
						{#if province.name?.toLowerCase().includes(provinsi?.toLowerCase())}
							<li>
								<button
									class="w-full text-start hover:bg-primary px-4 py-2"
									on:click={async () => {
										provinsi = province.name;
										provinsiId = province.id;
										await getAllKabupaten();
									}}
								>
									{province.name}
								</button>
							</li>
						{/if}
					{/each}
				{:else}
					<p class="px-2">Loading...</p>
				{/if}
			</ul>
		{/if}
	</Tabs.Content>
	<Tabs.Content value="kabupaten">
		<Input
			placeholder="Kabupaten"
			name="kabupaten"
			bind:value={kabupaten}
			on:focus={() => (focus = true)}
		/>
		{#if focus}
			<ul class="absolute w-full bg-background border rounded-md overflow-hidden z-[9999]">
				{#if !searching}
					{#each allKabupaten as kabs}
						{#if kabs.name?.toLowerCase().includes(kabupaten?.toLowerCase())}
							<li>
								<button
									class="w-full text-start hover:bg-primary px-4 py-2"
									on:click={async () => {
										kabupaten = kabs.name;
										kabupatenId = kabs.id;
										await getAllKecamatan();
									}}
								>
									{kabs.name}
								</button>
							</li>
						{/if}
					{/each}
				{:else}
					<p class="px-2">Loading...</p>
				{/if}
			</ul>
		{/if}
	</Tabs.Content>
	<Tabs.Content value="kecamatan">
		<Input
			placeholder="Kecamatan"
			name="kecamatan"
			bind:value={kecamatan}
			on:focus={() => (focus = true)}
		/>
		{#if focus}
			<ul class="absolute w-full bg-background border rounded-md overflow-hidden z-[9999]">
				{#if !searching}
					{#each allKecamatan as kec}
						{#if kec.name?.toLowerCase().includes(kecamatan?.toLowerCase())}
							<li>
								<button
									class="w-full text-start hover:bg-primary px-4 py-2"
									on:click={async () => {
										kecamatan = kec.name;
										kecamatanId = kec.id;
										await getAllKelurahan();
									}}
								>
									{kec.name}
								</button>
							</li>
						{/if}
					{/each}
				{:else}
					<p class="px-2">Loading...</p>
				{/if}
			</ul>
		{/if}
	</Tabs.Content>
	<Tabs.Content value="kelurahan">
		<Input
			placeholder="Kelurahan"
			name="kelurahan"
			bind:value={kelurahan}
			on:focus={() => (focus = true)}
		/>
		{#if allKelurahan.length > 0 && focus}
			<ul class="absolute w-full bg-background border rounded-md overflow-hidden z-[9999]">
				{#if !searching}
					{#each allKelurahan as kel}
						{#if kel.name?.toLowerCase().includes(kelurahan?.toLowerCase())}
							<li>
								<button
									class="w-full text-start hover:bg-primary px-4 py-2"
									on:click={async () => {
										kelurahan = kel.name;
										kelurahanId = kel.id;
										alamat = `${provinsiId};${kabupatenId};${kecamatanId};${kelurahanId}`;
										allKelurahan = [];
									}}
								>
									{kel.name}
								</button>
							</li>
						{/if}
					{/each}
				{:else}
					<p class="px-2">Loading...</p>
				{/if}
			</ul>
		{/if}
	</Tabs.Content>
</Tabs.Root>
