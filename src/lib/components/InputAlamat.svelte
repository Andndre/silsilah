<script lang="ts">
	import { onMount } from 'svelte';
	import * as Tabs from './ui/tabs';
	import * as Form from './ui/form';
	import { cn } from '$lib/utils';
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
		const res = await fetch('/api/lokasi/provinsi');
		if (res.ok) {
			allProvinces = (await res.json()) as DataLokasi[];
		}
	}

	async function getAllKabupaten() {
		const res = await fetch(`/api/lokasi/kabupaten/${provinsiId}`);
		if (res.ok) {
			allKabupaten = (await res.json()) as DataLokasi[];
		}
	}

	async function getAllKecamatan() {
		const res = await fetch(`/api/lokasi/kecamatan/${kabupatenId}`);
		if (res.ok) {
			allKecamatan = (await res.json()) as DataLokasi[];
		}
	}

	async function getAllKelurahan() {
		const res = await fetch(`/api/lokasi/kelurahan/${kecamatanId}`);
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
			id="provinsi"
			placeholder="Provinsi"
			name="provinsi"
			bind:value={provinsi}
			on:focus={() => (focus = true)}
			on:blur={() => setTimeout(() => (focus = false), 500)}
		/>
		{#if focus}
			<ul class="absolute w-full bg-background border rounded-md overflow-hidden">
				{#each allProvinces as province}
					{#if province.name?.toLowerCase().includes(provinsi?.toLowerCase())}
						<li>
							<button
								class="w-full text-start hover:bg-primary px-4 py-2"
								on:click={async () => {
									provinsi = province.name;
									provinsiId = province.id;
									activeTab = 'kabupaten';
									await getAllKabupaten();
								}}
							>
								{province.name}
							</button>
						</li>
					{/if}
				{/each}
			</ul>
		{/if}
	</Tabs.Content>
	<Tabs.Content value="kabupaten">
		<Input
			id="kabupaten"
			placeholder="Kabupaten"
			name="kabupaten"
			bind:value={kabupaten}
			on:focus={() => (focus = true)}
			on:blur={() => setTimeout(() => (focus = false), 500)}
		/>
		{#if focus}
			<ul class="absolute w-full bg-background border rounded-md overflow-hidden">
				{#each allKabupaten as kabs}
					{#if kabs.name?.toLowerCase().includes(kabupaten?.toLowerCase())}
						<li>
							<button
								class="w-full text-start hover:bg-primary px-4 py-2"
								on:click={async () => {
									kabupaten = kabs.name;
									kabupatenId = kabs.id;
									activeTab = 'kecamatan';
									// document.getElementById('kecamatan')?.focus();
									await getAllKecamatan();
								}}
							>
								{kabs.name}
							</button>
						</li>
					{/if}
				{/each}
			</ul>
		{/if}
	</Tabs.Content>
	<Tabs.Content value="kecamatan">
		<Input
			id="kecamatan"
			placeholder="Kecamatan"
			name="kecamatan"
			bind:value={kecamatan}
			on:focus={() => (focus = true)}
			on:blur={() => setTimeout(() => (focus = false), 500)}
		/>
		{#if focus}
			<ul class="absolute w-full bg-background border rounded-md overflow-hidden">
				{#each allKecamatan as kec}
					{#if kec.name?.toLowerCase().includes(kecamatan?.toLowerCase())}
						<li>
							<button
								class="w-full text-start hover:bg-primary px-4 py-2"
								on:click={async () => {
									kecamatan = kec.name;
									kecamatanId = kec.id;
									activeTab = 'kelurahan';
									// document.getElementById('kelurahan')?.focus();
									await getAllKelurahan();
								}}
							>
								{kec.name}
							</button>
						</li>
					{/if}
				{/each}
			</ul>
		{/if}
	</Tabs.Content>
	<Tabs.Content value="kelurahan">
		<Input
			id="kelurahan"
			placeholder="Kelurahan"
			name="kelurahan"
			bind:value={kelurahan}
			on:focus={() => (focus = true)}
			on:blur={() => setTimeout(() => (focus = false), 500)}
		/>
		{#if allKelurahan.length > 0 && focus}
			<ul class="absolute w-full bg-background border rounded-md overflow-hidden">
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
			</ul>
		{/if}
	</Tabs.Content>
</Tabs.Root>
