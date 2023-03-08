<script lang="ts">
	import { page } from '$app/stores';
	import type { Deck } from '$lib/types';

	export let deck: Deck | undefined = undefined;

	let menuItems = [
		{
			href: '/decks',
			title: 'Decks',
			active: $page.url.pathname === '/decks'
		},
		deck && {
			href: $page.url.pathname,
			title: deck.name,
			active: true
		}
	].filter(Boolean);
</script>

<div class="navbar">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">🥐</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			{#each menuItems as item}
				<li>
					<a
						href={item.href}
						class="decoration-wavy decoration-2 underline-offset-4 decoration-accent"
						class:underline={item.active}>{item.title}</a
					>
				</li>
			{/each}
		</ul>
	</div>
</div>
