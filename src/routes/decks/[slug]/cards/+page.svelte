<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';
	import { ArrowLeft, ArrowRight, Undo2 } from 'lucide-svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let currentIndex = 0;

	$: currentCard = data.cards[currentIndex];
	$: currentContent = showingBack ? currentCard.back : currentCard.front;
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
		<NavBar deck={data.deck} />
	</svelte:fragment>

	<Container>
		<div class="mt-1 flex items-center">
			<button type="button" on:click={() => move(-1)} class="btn btn-sm variant-soft"
				><ArrowLeft /></button
			>
			<button type="button" on:click={flip} class="ml-1 btn btn-sm variant-soft"><Undo2 /></button>
			<div class="grow" />
			<div class="badge">{`${currentIndex + 1}/${totalNumberOfCards}`}</div>
			<div class="grow" />
			<button type="button" on:click={() => move(1)} class="btn btn-sm variant-soft"
				><ArrowRight /></button
			>
		</div>
	</Container>
	{#key currentCard.id}
		<div class="mt-4 px-4 sm:px-8">
			<div
				class="w-full almost-full-height sm:w-[32rem] md:w-[48rem] flex items-center justify-center"
			>
				<div class="mt-2 p-4">
					{#each currentContent.replaceAll('{{', '').replaceAll('}}', '').split('\n') as line}
						<p class="text-3xl">{line}</p>
					{/each}
				</div>
			</div>
		</div>
	{/key}
</AppShell>

<style>
	.almost-full-height {
		height: calc(100vh - 12rem);
	}
</style>
