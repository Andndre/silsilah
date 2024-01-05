<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	
	import Maxw from './maxw.svelte';

	import { H1 } from '$lib/components/typography/index';
	import type { PageServerData } from './$types';
	import { capitalize, formatDate, joinAlamat, tempatTanggalLahir } from '$lib/utils';

	export let data: PageServerData;

	const { pageData } = data;

	const keteranganMargaKeluarga = pageData?.marga_.keterangan
		? ` (${pageData.marga_.keterangan})`
		: '';
</script>
<Maxw>
	<H1>Informasi Keluarga</H1>
	<div class="pt-4"></div>
	<p>
		Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis necessitatibus rem sit
		quasi odit quis molestias quos cumque dicta. Quisquam voluptatem recusandae minus ullam iure
		cumque, perferendis error suscipit eaque!
	</p>
	<div class="pt-12"></div>
	{#if pageData}
		<Table.Root>
			<Table.Caption>Data Keluarga yang terekam pada Sistem Digitalisasi Silsilah</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[300px]">Property</Table.Head>
					<Table.Head>Nilai</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell class="font-medium">Alamat keluarga</Table.Cell>
					<Table.Cell>{joinAlamat(pageData.alamat)}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Marga</Table.Cell>
					<Table.Cell>{pageData.marga_.nama} {keteranganMargaKeluarga}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Jumlah Anggota Keluarga (+ Orang Tua)</Table.Cell>
					<Table.Cell>{pageData.anggotaKeluarga.length + 2}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Nama Ayah</Table.Cell>
					<Table.Cell>{pageData.suami_.nama}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Agama Ayah</Table.Cell>
					<Table.Cell>{pageData.suami_.agama_.nama}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Tempat / Tanggal Lahir Ayah</Table.Cell>
					<Table.Cell
						>{capitalize(pageData.kelurahanLahirSuami)} / {formatDate(
							pageData.suami_.tanggalLahir,
						)}</Table.Cell
					>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Nama Ibu</Table.Cell>
					<Table.Cell>{pageData.istri_.nama}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Agama Ibu</Table.Cell>
					<Table.Cell>{pageData.istri_.agama_.nama}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Tempat / Tanggal Lahir Ibu</Table.Cell>
					<Table.Cell
						>{capitalize(pageData.kelurahanLahirIstri)} / {formatDate(
							pageData.istri_.tanggalLahir,
						)}</Table.Cell
					>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Marga Ibu (sebelum menikah)</Table.Cell>
					<Table.Cell>{pageData.istri_.keluargaAsal?.marga || 'Tidak Ada Data'}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Menikah pada</Table.Cell>
					<Table.Cell>{formatDate(pageData.user.tanggal_menikah)}</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	{/if}
</Maxw>