<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import Confetti from 'js-confetti';
	import { add } from 'date-fns';
	import NavBar from '$lib/components/NavBar.svelte';
	import PlayWithBlur from '$lib/components/PlayWithBlur.svelte';
	import type { PageData } from './$types';
	import Congrats from '$lib/components/Congrats.svelte';
	import type { Card, Score } from '$lib/types';
	import { SPACE_PER_BOX, type BOX_NUMBER } from './const';
	import Container from '$lib/components/Container.svelte';
	import PlayWithInput from '$lib/components/PlayWithInput.svelte';

	export let data: PageData;

	let currentIndex = 0;
	let hardMode = data.deck.hard_mode || false;

	let cardsToReview: Card[] = [];
	let reviewingMistakes = false;

	$: currentCard = reviewingMistakes ? cardsToReview[currentIndex] : data.cards[currentIndex];
	$: totalNumberOfCards = reviewingMistakes ? cardsToReview.length : data.cards.length;

	const HARD_MODE_ADVANTAGE = 3;

	const assignToBox = async ({ cardId, boxNumber }: { cardId: string; boxNumber: BOX_NUMBER }) => {
		const now = new Date();
		const next = add(now, {
			hours: SPACE_PER_BOX[boxNumber]
		});
		await data.supabase
			.from('cards')
			.update({
				box: boxNumber,
				last_played_ts: now.toISOString(),
				next_play_ts: next.toISOString()
			})
			.eq('id', cardId);
	};

	const bumpUp = async ({ card }: { card: Card }) => {
		await assignToBox({
			cardId: card.id,
			boxNumber: (card.box + 1) as BOX_NUMBER
		});
	};

	const bumpDown = async ({ card }: { card: Card }) => {
		await assignToBox({
			cardId: card.id,
			boxNumber: Math.max(card.box - 1, 1) as BOX_NUMBER
		});
	};

	const onSubmit = async (score: Score) => {
		if (score !== 3) {
			cardsToReview.push(currentCard);
			cardsToReview = cardsToReview;
		}
		if (!reviewingMistakes) {
			if (score === 1) {
				await assignToBox({
					cardId: currentCard.id,
					boxNumber: 1
				});
			} else if (score === 2) {
				await bumpDown({ card: currentCard });
			} else if (score === 3) {
				await bumpUp({ card: currentCard });
			}
		}
		await data.supabase.rpc('update_deck_score', {
			deck_id: data.deck.id,
			score: (hardMode ? HARD_MODE_ADVANTAGE : 1) * score
		});
	};

	const updateHardMode = async () => {
		await data.supabase
			.from('decks')
			.update({
				hard_mode: hardMode
			})
			.eq('id', data.deck.id);
	};

	const onNext = () => {
		currentIndex += 1;
		if (!reviewingMistakes && currentIndex === data.cards.length) {
			currentIndex = 0;
			reviewingMistakes = true;
		}
		if (reviewingMistakes && currentIndex === cardsToReview.length) {
			new Confetti().addConfetti();
		}
	};
</script>

<MetaTags title="Play Quiz | Croissant" />

<NavBar deck={data.deck} />

{#if currentIndex < totalNumberOfCards}
	<Container>
		{#if reviewingMistakes}
			<div class="alert shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="stroke-current flex-shrink-0 w-6 h-6"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>Let's review your mistakes.</span>
				</div>
			</div>
		{/if}

		<div class="mt-8 flex justify-between items-center">
			<div class="badge badge-outline">{`${currentIndex + 1}/${totalNumberOfCards}`}</div>
			<div>
				<div class="form-control">
					<label class="cursor-pointer label">
						<span class="label-text mr-2 text-xs uppercase opacity-75" class:font-bold={hardMode}
							>Hard Mode</span
						>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							bind:checked={hardMode}
							on:change={updateHardMode}
						/>
					</label>
				</div>
			</div>
		</div>
	</Container>
	{#if hardMode}
		<PlayWithInput card={currentCard} {onNext} {onSubmit} />
	{:else}
		<PlayWithBlur card={currentCard} {onNext} {onSubmit} />
	{/if}
	<Container>
		<div class="mt-4 flex justify-end">
			<a href="./add" class="btn btn-ghost opacity-50 hover:opacity-100">Add cards ?</a>
		</div>
	</Container>
{:else}
	<div class="mt-8">
		<Congrats />
	</div>
{/if}
