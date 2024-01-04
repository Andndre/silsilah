<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import type { ActionData, PageServerData } from './$types';
	import { H1 } from '$lib/components/typography/index';
	import { capitalize, formatDate } from '$lib/utils';
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
		FileText,
		CheckCircle
	} from 'lucide-svelte';
	import { getKelurahanClient, refreshKey } from '$lib/fetching';
	import toast, { Toaster } from 'svelte-french-toast';

	import Button from '$lib/components/ui/button/button.svelte';
	import clsx from 'clsx';

	export let data: PageServerData;
	export let form: ActionData;

	let deleteTimer = 0;

	let selected = data.pageData.anggotaKeluarga[0];
	let showDeleteConfirm = false;

	function deleteClicked() {
		showDeleteConfirm = false;
		console.log('Menghapus data', selected);
		const d = document.getElementById('form-delete') as HTMLFormElement;
	}
	async function refreshRefKey() {
		const newKey = await refreshKey(selected.id);
		pageData.anggotaKeluarga.find((anggota) => anggota.id === selected.id)!.refKey = newKey;
	}
	const { pageData } = data;
</script>

{#if form != null}
	<AlertDialog.Root open={form.success != null}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title
					class={clsx(
						'flex items-center',
						form.success ? 'text-green-500' : 'text-red-500',
					)}
					>
					{#if form.success}
						<CheckCircle class="mr-3 h-4 w-4" />{form.message}
					{:else}
						<AlertTriangle class="mr-3 h-4 w-4"/>{form.message}
					{/if}
				</AlertDialog.Title>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Action
					on:click={() => {
						form = null;
					}}>Konfirmasi</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}

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
						<Table.Head>Tempat / Tanggal Lahir</Table.Head>
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
										src={anggota.gambar ||
											`/images/profile-${anggota.jenisKelamin}.png`}
										alt={anggota.nama}
									/>
									<Avatar.Fallback>##</Avatar.Fallback>
								</Avatar.Root>
							</Table.Cell>
							<Table.Cell class="font-medium">{anggota.nama}</Table.Cell>
							<Table.Cell>
								{anggota.jenisKelamin === 'L'
									? '♂️ Laki-Laki'
									: '♀️ Perempuan'}
							</Table.Cell>
							<Table.Cell>
								{#await getKelurahanClient(anggota.tempatLahir)}
									memuat alamat...
								{:then kel}
									{capitalize(kel || '{terjadi kesalahan}')} / {formatDate(
											anggota.tanggalLahir,
									)}
								{/await}
							</Table.Cell>
							<Table.Cell
								>{anggota.status === 'BM' ? 'Belum Menikah' : 'Menikah'}</Table.Cell
							>
							<Table.Cell class="text-center w-10"
								><Button
									builders={[builder]}
									variant="ghost"
									class="transition-colors duration-300"
									on:click={() => (selected = anggota)}
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
					<span><a href="/anggota-keluarga/edit/{selected.id}">Edit Data</a></span>
					<DropdownMenu.Shortcut><FileText class="h-4 w-4" /></DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="cursor-pointer" on:click={async () => {
					const prev = selected.refKey;
					await toast.promise(refreshRefKey(), {
						loading: 'Memuat...',
						success: 'Berhasil refresh ref key',
						error: 'Gagal refresh ref key',
					});
					const curr = selected.refKey;
					if (curr !== prev) {
						await navigator.clipboard.writeText(curr || '{terjadi kesalahan}');
						toast.success('Berhasil menyalin ref key');
					}
				}}>
					<RefreshCcw class="mr-3 h-4 w-4" />
					<span>Refresh Ref Key & Salin</span>
					<DropdownMenu.Shortcut><Link class="h-4 w-4" /></DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Item class="cursor-pointer" on:click={async () => {
					await navigator.clipboard.writeText(selected.refKey || '{terjadi kesalahan}');
					toast.success('Berhasil menyalin ref key');
				}}>
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
				<button
					class={clsx('contents')}
					type="submit"
					disabled={deleteTimer != 0}
					on:click={(e) => {
						e.preventDefault();
						deleteTimer = 5;
						showDeleteConfirm = true;
						const timer = setInterval(() => {
							deleteTimer = deleteTimer - 1;
							if (deleteTimer === 0) {
								clearInterval(timer);
							}
						}, 1000);
					}}
				>
					<DropdownMenu.Item
						class="cursor-pointer bg-red-100/50 dark:bg-red-950/50 hover:dark:bg-red-950/80"
					>
						<TrashIcon class="mr-3 h-4 w-4" />
						<span>Hapus</span>
						<DropdownMenu.Shortcut
							><AlertTriangle class="h-4 w-4" /></DropdownMenu.Shortcut
						>
					</DropdownMenu.Item>
				</button>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
{#if selected}
<form class="contents" action="?/delete" id="form-delete" method="POST">
	<input type="hidden" name="id" bind:value={selected.id} />
</form>
{/if}
<AlertDialog.Root bind:open={showDeleteConfirm}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="text-red-500 flex items-center"
				><AlertTriangle class="mr-3 h-4 w-4" /> Apakah Anda yakin ingin menghapus @{pageData.anggotaKeluarga.find(
					(anggota) => anggota.id === selected.id,
				)?.nama || '{terjadi kesalahan}'}?</AlertDialog.Title
			>
			<AlertDialog.Description>
				<span class="text-red-500">PERINGATAN!</span> Semua data keluarga dari anggota ini (jika
				sudah ditautkan ke akun keluarga lain atau tidak ada akun) akan dihapus secara permanen
				dan tidak bisa dikembalikan
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
			<AlertDialog.Action
				disabled={deleteTimer != 0}
				on:click={() => {
					deleteClicked();
				}}>Hapus ({deleteTimer})</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<Toaster position="bottom-center" />
