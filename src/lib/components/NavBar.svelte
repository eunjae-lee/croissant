<script lang="ts">
	import { page } from '$app/stores';
	import type { Deck } from '$lib/types';
	import { AppBar } from '@skeletonlabs/skeleton';
	import Logo from './Logo.svelte';

	export let deck: Deck | undefined = undefined;

	let menuItems = [
		{
			href: '/decks',
			title: 'Decks',
			active: $page.url.pathname === '/decks'
		}
	];
	// if (deck) {
	// 	menuItems.push({
	// 		href: $page.url.pathname,
	// 		title: deck.name,
	// 		active: true
	// 	});
	// }
</script>

<AppBar
	background="bg-surface-200"
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
	><svelte:fragment slot="lead">
		<div class="ml-2">
			<a href="/"><Logo /></a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<ul class="flex gap-2 sm:gap-4 px-1">
			{#each menuItems as item}
				<li>
					<a
						href={item.href}
						class="btn"
						class:variant-soft-secondary={!item.active}
						class:variant-filled-secondary={item.active}>{item.title}</a
					>
				</li>
			{/each}
		</ul>
	</svelte:fragment>
</AppBar>
