<script lang="ts">
	import { formSchema, type FormSchema } from './schema';
	import type { PageData } from './$types';
	import RegisterForm from './form.svelte';
	import H3 from '$lib/components/typography/H3.svelte';

	export let data: PageData;
</script>

<div class="flex flex-col container mx-auto max-w-3xl mt-11">
	<H3>Daftar Akun</H3>
	<div class="pt-8"></div>
	<RegisterForm pilihanAgama={data.allAgama} form={data.form} />
	<div class="pt-8"></div>
</div>
