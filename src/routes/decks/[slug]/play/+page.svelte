<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import Confetti from 'js-confetti';
	import { add } from 'date-fns';
	import NavBar from '$lib/components/NavBar.svelte';
	import Play from '$lib/components/Play.svelte';
	import type { PageData } from './$types';
	import Congrats from '$lib/components/Congrats.svelte';
	import type { Card } from '$lib/types';

	export let data: PageData;
	let userId = data.session!.user.id;
	let currentIndex = 0;
	$: currentCard = data.cards[currentIndex];

	$: if (data.cards) {
		currentIndex = 0;
	}

	let ALPHA = 4;
	let SPACE_PER_BOX = {
		1: 24 * 1 - ALPHA, // almost 1 day
		2: 24 * 2 - ALPHA, // almost 2 days
		3: 24 * 5 - ALPHA, // almost 5 days
		4: 24 * 8 - ALPHA, // almost 8 days
		5: 24 * 14 - ALPHA, // almost 14 days
		6: 0
	};

	type BOX_NUMBER = keyof typeof SPACE_PER_BOX;

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
			boxNumber: Math.min(card.box - 1, 1) as BOX_NUMBER
		});
	};

	const onSubmit = async (score: 1 | 2 | 3) => {
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
</script>

<MetaTags title="Play Quiz | Croissant" />

<NavBar deck={data.deck} />

{#if currentIndex < data.cards.length}
	<Play
		counter={`${currentIndex + 1}/${data.cards.length}`}
		card={currentCard}
		onNext={() => {
			currentIndex += 1;
			if (currentIndex === data.cards.length) {
				new Confetti().addConfetti();
			}
		}}
		{onSubmit}
	/>
{:else}
	<div class="mt-8">
		<Congrats />
	</div>
{/if}
