<script lang="ts">
	import type { PageData } from './$types';
	import LoginForm from './form.svelte';
	import H1 from '$lib/components/typography/H1.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	export let data: PageData;
</script>

<div class="flex flex-col container mx-auto max-w-3xl mt-11">
	<H1>Login Akun</H1>
	<div class="pt-4"></div>
	<Separator />
	<div class="pt-6"></div>
	<p>Ini merupakan halaman untuk masuk ke akun Anda.</p>
	<div class="pt-12"></div>
	<Alert.Root>
		<Alert.Title>Belum punya akun?</Alert.Title>
		<Alert.Description>
			Anda bisa mendaftar pada halaman <a class="underline text-primary" href="/register"
				>berikut</a
			>
		</Alert.Description>
	</Alert.Root>
	<div class="pt-5"></div>
	<LoginForm form={data.form} />
	<div class="pt-8"></div>
</div>
