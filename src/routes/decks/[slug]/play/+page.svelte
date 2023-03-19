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
	$: currentCard = data.cards[currentIndex];
	let hardMode = data.deck.hard_mode || false;

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
		await data.supabase.rpc('update_deck_score', { deck_id: data.deck.id, score });
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
		if (currentIndex === data.cards.length) {
			new Confetti().addConfetti();
		}
	};
</script>

<MetaTags title="Play Quiz | Croissant" />

<NavBar deck={data.deck} />

{#if currentIndex < data.cards.length}
	<Container>
		<div class="mt-8 flex justify-between items-center">
			<div class="badge badge-outline">{`${currentIndex + 1}/${data.cards.length}`}</div>
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
{:else}
	<div class="mt-8">
		<Congrats />
	</div>
{/if}
