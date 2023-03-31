<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import { Info, Plus, Zap, List } from 'lucide-svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { Deck } from '$lib/types';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';

	export let data: PageData;
	let decks: Deck[] = [];
	let status: 'init' | 'loaded';

	type CardsToPlay = {
		[deckId: string]: {
			today?: number;
			tomorrow?: number;
		};
	};
	let cardsToPlay: CardsToPlay = {};

	type TotalCards = {
		[deckId: string]: number;
	};
	let totalCards: TotalCards = {};

	async function loadData() {
		await Promise.all([loadDecks(), loadCardsToPlay(), loadTotalCards()]);
	}

	async function loadDecks() {
		const { data: result } = await data.supabase.from('decks').select('*');
		decks = result || [];
		status = 'loaded';
	}

	async function loadCardsToPlay() {
		const { data: cardsToPlayRows } = await data.supabase.rpc('cards_to_play', {
			param_user_id: data.session!.user.id
		});
		cardsToPlay = (cardsToPlayRows || []).reduce<CardsToPlay>((acc, row) => {
			if (!acc[row.r_deck_id]) {
				acc[row.r_deck_id] = {};
			}
			acc[row.r_deck_id][row.r_when_to_play as 'today' | 'tomorrow'] = row.r_count;
			return acc;
		}, {});
	}

	async function loadTotalCards() {
		const { data: totalCardsRows } = await data.supabase.rpc('total_cards', {
			param_user_id: data.session!.user.id
		});
		totalCards = (totalCardsRows || []).reduce<TotalCards>((acc, row) => {
			acc[row.r_deck_id] = row.r_count;
			return acc;
		}, {});
	}

	async function createDeck() {
		const name = prompt('What is the name of the new deck?');
		if (!name) {
			alert('Please enter a valid deck name.');
			return;
		}
		await data.supabase.from('decks').insert({
			name,
			user_id: data.session!.user.id
		});
		await loadDecks();
	}

	function formatNumber(number: number) {
		return new Intl.NumberFormat().format(number);
	}

	loadData();
</script>

<MetaTags title="Decks | Croissant" />

<AppShell>
	<svelte:fragment slot="header">
		<NavBar />
	</svelte:fragment>

	<div class="my-8">
		<Container>
			<div class="grid gap-8 md:grid-cols-2">
				{#each decks as deck (deck.id)}
					<div class="card bg-surface-200">
						<header class="card-header flex items-center justify-between">
							<h3>
								<span>{deck.name}</span>
								<span class="ml-2 font-normal text-sm"
									>{formatNumber(deck.play_score_sum || 0)}XP</span
								>
							</h3>
							<a href={`/decks/${deck.slug}/info`} class="btn variant-soft-surface"><Info /></a>
						</header>

						<section class="p-4 flex flex-col gap-4 my-4">
							<div>
								<p class="text-sm opacity-75">Total Cards</p>
								<p class="text-2xl font-bold">
									{totalCards[deck.id] ? formatNumber(totalCards[deck.id]) : '-'}
								</p>
							</div>
							<div class="grid grid-cols-2">
								<div>
									<p class="text-sm opacity-75">To Study Today</p>
									<p class="text-2xl font-bold">
										{cardsToPlay[deck.id] ? formatNumber(cardsToPlay[deck.id].today || 0) : '-'}
									</p>
								</div>
								<div>
									<p class="text-sm opacity-75">Tomorrow</p>
									<p class="text-2xl font-bold">
										{cardsToPlay[deck.id] ? formatNumber(cardsToPlay[deck.id].tomorrow || 0) : '-'}
									</p>
								</div>
							</div>
						</section>

						<footer class="card-footer flex flex-nowrap justify-between">
							<div class="flex gap-4">
								<a href={`/decks/${deck.slug}/add`} class="btn variant-filled-primary"
									><Plus size={18} /><span class="ml-2">New</span></a
								>
								<a href={`/decks/${deck.slug}/play`} class="btn variant-filled-primary"
									><Zap size={18} /><span class="ml-2">Play</span></a
								>
							</div>
							<a href={`/decks/${deck.slug}/list`} class="btn variant-soft-primary" title="List"
								><List /></a
							>
						</footer>
					</div>
				{/each}

				{#if status === 'loaded'}
					<div class="card bg-surface-200">
						<section class="p-8">
							{#if decks.length === 0}
								<h3 class="text-center">Create your first deck</h3>
							{:else}
								<h3 class="text-center text-lg font-normal">Want to learn something else?</h3>
							{/if}
							<div class="mt-6 flex justify-center">
								<button class="btn variant-soft-primary" on:click={createDeck}>Create a deck</button
								>
							</div>
						</section>
					</div>
				{/if}
			</div>
		</Container>
	</div>
</AppShell>
