<script lang="ts">
	import { H1 } from '$lib/components/typography/index';
	import type { PageData } from './$types';

	import EditAnggota from './form.svelte';

	export let data: PageData;
</script>

<H1>Edit Anggota Keluarga</H1>
<div class="pt-4"></div>
<p>
	Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis necessitatibus rem sit
	quasi odit quis molestias quos cumque dicta. Quisquam voluptatem recusandae minus ullam iure
	cumque, perferendis error suscipit eaque!
</p>
<div class="pt-5"></div>
<p><strong class="font-medium">Data yang diedit</strong>: {data.anggota.nama}</p>
<div class="pt-12"></div>

<EditAnggota form={data.form} prevData={data.anggota} allAgama={data.allAgama} />

<div class="grid grid-cols-12">
	<div class="col-span-12"></div>
	<div class="col-span-8"></div>
	<div class="col-span-4"></div>
</div>
