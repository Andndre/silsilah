<script lang="ts">
	import { H1 } from '$lib/components/typography/index';
	import type { PageData } from './$types';
	import FormTambah from './form.svelte';

	export let data: PageData;
</script>

<H1>Tambah Anggota Keluarga</H1>
<div class="pt-4"></div>
<p>
	Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis necessitatibus rem sit
	quasi odit quis molestias quos cumque dicta. Quisquam voluptatem recusandae minus ullam iure
	cumque, perferendis error suscipit eaque!
</p>
<div class="pt-12"></div>

<FormTambah form={data.form} />
