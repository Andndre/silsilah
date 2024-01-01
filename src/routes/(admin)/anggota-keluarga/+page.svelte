<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	import type { PageServerData } from './$types';
	import { H1 } from '$lib/components/typography/index';
	import { formatDate } from '$lib/utils';
	import { PlusIcon, PencilIcon } from 'lucide-svelte';

	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageServerData;

	const { pageData } = data;
</script>

{#if pageData}
	<H1>Anggota Keluarga</H1>
	<div class="pt-4"></div>
	<p>
		Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis necessitatibus rem sit
		quasi odit quis molestias quos cumque dicta. Quisquam voluptatem recusandae minus ullam iure
		cumque, perferendis error suscipit eaque!
	</p>
	<div class="pt-12"></div>
	<div class="flex">
		<Button href="/anggota-keluarga/tambah"><PlusIcon class="mr-3" /> Tambah Data</Button>
	</div>
	<div class="pt-6"></div>
	<Table.Root>
		<Table.Caption
			>Semua anggota keluarga yang tercatat pada Sistem Digitalisasi Silsilah</Table.Caption
		>
		<Table.Header>
			<Table.Row>
				<Table.Head class="font-bold">Nama</Table.Head>
				<Table.Head>Jenis Kelamin</Table.Head>
				<Table.Head>Tanggal Lahir</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each pageData.anggotaKeluarga as anggota, i (i)}
				<Table.Row>
					<Table.Cell class="font-medium">{anggota.nama}</Table.Cell>
					<Table.Cell>{anggota.jenisKelamin}</Table.Cell>
					<Table.Cell>{formatDate(anggota.tanggalLahir)}</Table.Cell>
					<Table.Cell class="text-right"
						>{anggota.status === 'BM' ? 'Belum Menikah' : 'Menikah'}</Table.Cell
					>
					<Table.Cell
						><Button
							variant="secondary"
							class="hover:bg-gray-300 transition-colors duration-300"
							><PencilIcon class="h-4" /></Button
						></Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
