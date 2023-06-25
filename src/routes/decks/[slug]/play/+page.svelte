<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import Confetti from 'js-confetti';
	import { add, startOfTomorrow } from 'date-fns';
	import NavBar from '$lib/components/NavBar.svelte';
	import PlayWithBlur from '$lib/components/PlayWithBlur.svelte';
	import type { PageData } from './$types';
	import Congrats from '$lib/components/Congrats.svelte';
	import type { Card, Score } from '$lib/types';
	import Container from '$lib/components/Container.svelte';
	import PlayWithInput from '$lib/components/PlayWithInput.svelte';
	import { Info } from 'lucide-svelte';
	import { AppShell, SlideToggle } from '@skeletonlabs/skeleton';
	import { boxSettingsSchema } from '$lib/schemas';

	export let data: PageData;

	let currentIndex = 0;
	let hardMode = data.deck.hard_mode || false;

	let cardsToReview: Card[] = [];
	let reviewingMistakes = false;

	let boxSettings = boxSettingsSchema.parse(JSON.parse(data.deck.box_settings!));

	$: currentCard = reviewingMistakes ? cardsToReview[currentIndex] : data.cards[currentIndex];
	$: totalNumberOfCards = reviewingMistakes ? cardsToReview.length : data.cards.length;

	const HARD_MODE_ADVANTAGE = 3;

	const assignToBox = async ({ cardId, boxNumber }: { cardId: string; boxNumber: number }) => {
		const now = new Date();
		const next = add(startOfTomorrow(), {
			days: boxSettings.intervals[boxNumber - 1] - 1
		});
		await data.supabase
			.from('cards')
			.update({
				box: boxNumber,
				last_played_ts: now.toISOString(),
				next_play_ts: next.toISOString(),
				learn: boxNumber <= boxSettings.intervals.length
			})
			.eq('id', cardId);
	};

	const onSubmit = async (score: Score) => {
		if (score !== 3) {
			cardsToReview.push(currentCard);
			cardsToReview = cardsToReview;
		}
		if (!reviewingMistakes) {
			if (score === 1) {
				const boxNumber =
					boxSettings.when_wrong === 'to_first' ? 1 : Math.max(currentCard.box - 1, 1);
				await assignToBox({
					cardId: currentCard.id,
					boxNumber: boxNumber
				});
			} else if (score === 2) {
				// keep it in the same box, but run the following
				// so that it could update the next_play_ts
				await assignToBox({
					cardId: currentCard.id,
					boxNumber: currentCard.box
				});
			} else if (score === 3) {
				await assignToBox({
					cardId: currentCard.id,
					boxNumber: currentCard.box + 1
				});
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

<AppShell>
	<svelte:fragment slot="header">
		<NavBar deck={data.deck} />
	</svelte:fragment>

	{#if currentIndex < totalNumberOfCards}
		<div class="my-8">
			<Container>
				<h2 class="unstyled ml-2 mb-8 text-primary-700">[{data.deck.name}] Play Cards</h2>

				{#if reviewingMistakes}
					<div class="alert variant-soft-warning">
						<Info />
						<div class="alert-message">Let's review your mistakes.</div>
					</div>
				{/if}

				<div class="mt-8 flex justify-between items-center">
					<div class="badge">{`${currentIndex + 1}/${totalNumberOfCards}`}</div>
					<div>
						<SlideToggle
							name="hard-mode"
							size="sm"
							bind:checked={hardMode}
							on:change={updateHardMode}>Hard Mode</SlideToggle
						>
					</div>
				</div>
			</Container>
		</div>
		{#key currentCard.id}
			{#if hardMode}
				<PlayWithInput card={currentCard} {onNext} {onSubmit} />
			{:else}
				<PlayWithBlur card={currentCard} {onNext} {onSubmit} />
			{/if}
		{/key}
		<Container>
			<div class="my-4 flex justify-end">
				<a href="./add" class="btn variant-soft">Add cards ?</a>
			</div>
		</Container>
	{:else}
		<div class="mt-8">
			<Congrats />
		</div>
	{/if}
</AppShell>
