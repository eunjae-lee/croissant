<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';
	import { ArrowLeft, ArrowRight, Home, Undo2 } from 'lucide-svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { splitStringWithCloze } from '$lib/utils';

	export let data: PageData;

	let currentIndex = 0;

	$: currentCard = data.cards[currentIndex];
	$: linesSplitWithCloze = (showingBack ? currentCard.back : currentCard.front)
		.split('\n')
		.map(splitStringWithCloze);
	$: totalNumberOfCards = data.cards.length;

	let showingBack = true;

	const flip = () => {
		showingBack = !showingBack;
	};

	const move = (incr: number) => {
		if (currentIndex + incr >= data.cards.length || currentIndex + incr < 0) {
			goto('/decks');
			return;
		}

		currentIndex += incr;
	};
</script>

<MetaTags title="Play Quiz | Croissant" />

<AppShell>
	<svelte:fragment slot="header">
		<Container>
			<div class="mt-2 flex items-center">
				<div class="grow basis-1/3 flex gap-1">
					<button type="button" on:click={() => move(-1)} class="btn btn-sm variant-soft"
						><ArrowLeft /></button
					>
					<a href="/decks" class="btn btn-sm variant-soft"><Home /></a>
				</div>
				<div class="badge">{`${currentIndex + 1}/${totalNumberOfCards}`}</div>
				<div class="grow basis-1/3 flex gap-1 justify-end">
					<button type="button" on:click={flip} class="btn btn-sm variant-soft"><Undo2 /></button>
					<button type="button" on:click={() => move(1)} class="btn btn-sm variant-soft"
						><ArrowRight /></button
					>
				</div>
			</div>
		</Container>
	</svelte:fragment>

	{#key currentCard.id}
		<div class="m-4 sm:m-8">
			<div class="space-y-4">
				{#each linesSplitWithCloze as line}
					<p class="text-3xl">
						{#each line as item, index (index)}
							{#if item.type === 'text'}
								<span>{@html item.content.split('\n').join('<br />')}</span>
							{:else if item.type === 'cloze'}
								<span class="text-primary-600 font-bold"
									>{@html item.content.split('\n').join('<br />')}</span
								>
							{/if}
						{/each}
					</p>
				{/each}
			</div>
		</div>
	{/key}
</AppShell>
