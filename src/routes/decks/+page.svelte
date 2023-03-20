<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import { Info, Plus, Zap, List } from 'lucide-svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { Deck } from '$lib/types';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';

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

<NavBar />

<div class="mt-8">
	<Container>
		<div class="grid gap-8 md:grid-cols-2">
			{#each decks as deck (deck.id)}
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body justify-between">
						<h2 class="card-title flex items-center">
							<p>
								<span>{deck.name}</span>
								<span class="font-normal text-sm">{formatNumber(deck.play_score_sum || 0)}XP</span>
							</p>
							<a href={`/decks/${deck.slug}/info`} class="btn btn-ghost"><Info /></a>
						</h2>
						<hr />
						<div class="flex flex-col gap-4 my-4">
							<div>
								<p class="text-sm opacity-75">Total Cards</p>
								<p class="text-2xl font-bold">
									{totalCards[deck.id] ? formatNumber(totalCards[deck.id]) : ''}
								</p>
							</div>
							<div class="grid grid-cols-2">
								<div>
									<p class="text-sm opacity-75">To Study Today</p>
									<p class="text-2xl font-bold">
										{cardsToPlay[deck.id] ? formatNumber(cardsToPlay[deck.id].today || 0) : ''}
									</p>
								</div>
								<div>
									<p class="text-sm opacity-75">Tomorrow</p>
									<p class="text-2xl font-bold">
										{cardsToPlay[deck.id] ? formatNumber(cardsToPlay[deck.id].tomorrow || 0) : ''}
									</p>
								</div>
							</div>
						</div>
						<div class="card-actions flex-nowrap">
							<a href={`/decks/${deck.slug}/add`} class="btn btn-secondary"
								><Plus size={18} /><span class="ml-2">New</span></a
							>
							<a href={`/decks/${deck.slug}/play`} class="btn btn-primary"
								><Zap size={18} /><span class="ml-2">Play</span></a
							>
							<a href={`/decks/${deck.slug}/list`} class="btn btn-ghost" title="List"><List /></a>
						</div>
					</div>
				</div>
			{/each}

			<div class="card bg-base-100 shadow-xl">
				<div class="card-body h-48 items-center justify-center gap-8">
					{#if status === 'loaded' && decks.length === 0}
						<h2 class="card-title justify-center">Create your first deck</h2>
					{:else}
						<h2 class="card-title justify-center text-lg font-normal">
							Want to learn something else?
						</h2>
					{/if}
					<button class="btn btn-primary justify-center" on:click={createDeck}>Create a deck</button
					>
				</div>
			</div>
		</div>
	</Container>
</div>
