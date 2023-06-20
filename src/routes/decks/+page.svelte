<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import { Info, Plus, Zap, List } from 'lucide-svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { Deck } from '$lib/types';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import DeckCard from './DeckCard.svelte';

	export let data: PageData;
	let decks: Deck[] = [];
	let status: 'init' | 'loaded';
	let showArchivedDecks = false;

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
				{#each decks.filter((deck) => !deck.archived) as deck (deck.id)}
					<DeckCard {deck} totalCards={totalCards[deck.id]} cardsToPlay={cardsToPlay[deck.id]} />
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
							{#if decks.find((deck) => deck.archived) && !showArchivedDecks}
								<div class="mt-6 flex justify-center">
									<button
										class="btn btn-sm opacity-50 hover:opacity-100 variant-soft-secondary"
										on:click={() => (showArchivedDecks = true)}>View archived decks</button
									>
								</div>
							{/if}
						</section>
					</div>
				{/if}

				{#if showArchivedDecks}
					{#each decks.filter((deck) => deck.archived) as deck (deck.id)}
						<DeckCard {deck} totalCards={totalCards[deck.id]} cardsToPlay={cardsToPlay[deck.id]} />
					{/each}
				{/if}
			</div>
		</Container>
	</div>
</AppShell>
