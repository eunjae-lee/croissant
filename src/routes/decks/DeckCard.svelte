<script lang="ts">
	import type { Deck } from '$lib/types';
	import { Info, Plus, Zap, List, CreditCard } from 'lucide-svelte';

	export let deck: Deck;
	export let totalCards: number;
	export let cardsToPlay: {
		today?: number;
		tomorrow?: number;
	};

	function formatNumber(number: number) {
		return new Intl.NumberFormat().format(number);
	}
</script>

<div class="card bg-surface-200">
	<header class="card-header flex items-center justify-between">
		<h3 class="flex items-center">
			<span class="text-3xl font-cursive">{deck.name}</span>
			<span class="ml-2 font-semibold text-sm text-primary-900"
				>{formatNumber(deck.play_score_sum || 0)}</span
			>
			<span class="ml-0.5 font-normal text-sm text-primary-900 opacity-75">XP</span>
			{#if deck.archived}
				<span class="ml-2 badge variant-ghost">archived</span>
			{/if}
		</h3>
		<a href={`/decks/${deck.slug}/info`} class="btn variant-soft-surface"><Info /></a>
	</header>

	<section class="p-4 flex flex-col gap-4 my-4">
		<div>
			<p class="text-sm opacity-75">Total Cards</p>
			<p class="text-2xl font-bold">
				{totalCards ? formatNumber(totalCards) : '-'}
			</p>
		</div>
		<div class="grid grid-cols-2">
			<div>
				<p class="text-sm opacity-75">To Study Today</p>
				<p class="text-2xl font-bold">
					{cardsToPlay ? formatNumber(cardsToPlay.today || 0) : '-'}
				</p>
			</div>
			<div>
				<p class="text-sm opacity-75">Tomorrow</p>
				<p class="text-2xl font-bold">
					{cardsToPlay ? formatNumber(cardsToPlay.tomorrow || 0) : '-'}
				</p>
			</div>
		</div>
	</section>

	<footer class="card-footer flex flex-nowrap justify-between gap-2">
		<a href={`/decks/${deck.slug}/add`} class="btn variant-filled-primary"
			><Plus size={18} /><span class="ml-2">New</span></a
		>
		<a href={`/decks/${deck.slug}/play`} class="btn variant-filled-primary"
			><Zap size={18} /><span class="ml-2">Play</span></a
		>
		<a href={`/decks/${deck.slug}/cards`} class="btn btn-sm variant-soft-primary" title="Cards"
			><CreditCard size={16} /></a
		>
		<a href={`/decks/${deck.slug}/list`} class="btn btn-sm variant-soft-primary" title="List"
			><List size={16} /></a
		>
	</footer>
</div>
