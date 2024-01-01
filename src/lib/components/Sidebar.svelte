<script lang="ts">
	import Lucideicon from '$lib/components/Lucideicon.svelte';
	import { cn } from '$lib/utils';
	import type { NavItem } from '$lib/types';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let pathname: string;

	afterNavigate(() => {
		pathname = window.location.pathname
	})

	onMount(() => {
		pathname = window.location.pathname
	})

	export let sidebarNavItems: NavItem[];

</script>

<aside
	class={cn(
		'fixed lg:sticky lg:top-0 w-full bottom-0 bg-card-foreground dark:bg-black dark:text-white text-card border-r shadow-xl lg:min-h-screen lg:max-w-[250px] p-4 z-[100] flex flex-col lg:h-full',
	)}
>
	<div class="hidden lg:flex flex-col items-center mt-8">
		<p class="font-medium text-muted dark:text-muted-foreground">SILSILAH</p>
	</div>
	<div class="hidden lg:flex shrink-0 bg-border h-[1px] my-4"></div>
	<ul
		class="space-y-1 flex-1 flex lg:flex-col justify-between lg:justify-start w-full max-w-xl lg:max-w-full mx-auto"
	>
		{#each sidebarNavItems as item}
			<li
				title={item.title}
				class={cn(
					'hover:bg-accent-foreground dark:hover:bg-accent text-accent transition-all rounded-md',
					item.highlight.exec(pathname)
						? 'dark:bg-accent text-accent dark:text-accent-foreground'
						: 'text-muted-foreground',
				)}
			>
				<a class="flex items-center gap-3 lg:px-4 lg:py-2" href={item.href}>
					<Lucideicon name={item.icon} />
					<span class="hidden lg:block">{item.title}</span>
				</a>
			</li>
		{/each}
	</ul>
</aside>
