<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';

	import { LogOut, Moon, Sun, User } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	import type { NavItem } from '$lib/types';

	import Sidebar from '$lib/components/Sidebar.svelte';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	export let sidebarNavItems: NavItem[];
</script>

<div class="lg:flex lg:flex-row w-full min-h-screen">
	<Sidebar {sidebarNavItems} />
	<div class="flex-1 flex flex-col">
		<header class="flex justify-end shadow-sm border-b px-4 lg:px-8 py-2">
			<div class="flex items-center gap-3">
				<Popover.Root>
					<Popover.Trigger>
						<Avatar class="cursor-pointer">
							<AvatarImage src="/images/profile-L.png" alt="user avatar" />
							<AvatarFallback>AN</AvatarFallback>
						</Avatar>
					</Popover.Trigger>
					<Popover.Content class="z-[10000] p-0">
						<ul class="flex flex-col">
							<li>
								<a
									href="/#"
									class="flex px-4 py-4 items-center gap-3 transition-all hover:bg-accent"
								>
									<span>
										<User class="h-[16px]" />
									</span>{' '}
									Profil
								</a>
							</li>
							<li>
								<button
									on:click={() => toggleMode()}
									class="flex w-full px-4 py-4 items-center gap-3 transition-all hover:bg-accent"
								>
									<span>
										<Sun class="h-[16px] block dark:hidden" />
										<Moon class="bottom-0 top-0 h-[16px] hidden dark:block" />
									</span>
									Toggle Mode
								</button>
							</li>
							<li>
								<Separator />
							</li>
							<li>
								<a
									href="/logout"
									class="flex px-4 py-4 items-center gap-3 transition-all hover:bg-accent"
								>
									<span>
										<LogOut class="h-[16px]" />
									</span>{' '}
									Logout
								</a>
							</li>
						</ul>
					</Popover.Content>
				</Popover.Root>
			</div>
		</header>
		<div class="flex-1">
			<slot />
		</div>
		<footer class="px-4 md:px-8 py-4 border-t">
			Copyright © {new Date().getFullYear()}
		</footer>
	</div>
</div>
