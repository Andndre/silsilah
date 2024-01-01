<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import type { PageServerData } from './$types';
	import { H1 } from '$lib/components/typography/index';
	import { formatDate } from '$lib/utils';
	import {
		PlusIcon,
		PencilIcon,
		MoreVertical,
		TrashIcon,
		RefreshCcw,
		Clipboard,
		AlertTriangle,
		XCircle,
		Hash,
		FilePlus,
		File,
		Link,
		FileText
	} from 'lucide-svelte';

	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageServerData;

	let selected = -1;

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
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Table.Root>
				<Table.Caption
					>Semua anggota keluarga yang tercatat pada Sistem Digitalisasi Silsilah</Table.Caption
				>
				<Table.Header>
					<Table.Row>
						<Table.Head>#</Table.Head>
						<Table.Head class="font-bold">Nama</Table.Head>
						<Table.Head>Jenis Kelamin</Table.Head>
						<Table.Head>Tanggal Lahir</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head class="text-center">#</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each pageData.anggotaKeluarga as anggota, i (i)}
						<Table.Row>
							<Table.Cell class="w-9">
								<Avatar.Root>
									<Avatar.Image
										src="https://github.com/shadcn.png"
										alt="@shadcn"
									/>
									<Avatar.Fallback>CN</Avatar.Fallback>
								</Avatar.Root>
							</Table.Cell>
							<Table.Cell class="font-medium">{anggota.nama}</Table.Cell>
							<Table.Cell>{anggota.jenisKelamin}</Table.Cell>
							<Table.Cell>{formatDate(anggota.tanggalLahir)}</Table.Cell>
							<Table.Cell
								>{anggota.status === 'BM' ? 'Belum Menikah' : 'Menikah'}</Table.Cell
							>
							<Table.Cell class="text-center w-10"
								><Button
									builders={[builder]}
									variant="ghost"
									class="transition-colors duration-300"
									on:click={() => (selected = anggota.id)}
									><MoreVertical class="h-4 w-4" /></Button
								></Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56 z-[99999]">
			<DropdownMenu.Label class="text-center">Aksi</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Item class="cursor-pointer">
					<PencilIcon class="mr-3 h-4 w-4" />
					<span><a href="/anggota-keluarga/edit/{selected}">Edit Data</a></span>
					<DropdownMenu.Shortcut><FileText class="h-4 w-4" /></DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="cursor-pointer">
					<RefreshCcw class="mr-3 h-4 w-4" />
					<span>Refresh Ref Key & Salin</span>
					<DropdownMenu.Shortcut><Link class="h-4 w-4" /></DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Item class="cursor-pointer">
					<Clipboard class="mr-3 h-4 w-4" />
					<span>Salin Ref Key</span>
					<DropdownMenu.Shortcut><Link class="h-4 w-4" /></DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="cursor-pointer">
					<FilePlus class="mr-3 h-4 w-4" />
					<span>Tambah Cerita</span>
					<DropdownMenu.Shortcut><File class="h-4 w-4" /></DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="cursor-pointer">
					<XCircle class="mr-3 h-4 w-4" />
					<span>Meninggal</span>
					<DropdownMenu.Shortcut><Hash class="h-4 w-4" /></DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					class="cursor-pointer bg-red-100/50 dark:bg-red-950/50 hover:dark:bg-red-950/80"
				>
					<TrashIcon class="mr-3 h-4 w-4" />
					<span>Hapus</span>
					<DropdownMenu.Shortcut><AlertTriangle class="h-4 w-4" /></DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
