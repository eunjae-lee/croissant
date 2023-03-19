<script lang="ts">
	import type { Card, Score } from '$lib/types';
	import {
		compareTextLoosely,
		hasSomethingToReveal,
		splitStringWithCloze,
		type StringsSplitWithCloze
	} from '$lib/utils';
	import Container from './Container.svelte';
	import AutoResizingInput from './AutoResizingInput.svelte';

	export let card: Card;
	export let onNext: () => void;
	export let onSubmit: (score: Score) => Promise<void>;

	let status: 'init' | 'submitting' | 'revealed' = 'init';

	let stringSplitWithCloze: StringsSplitWithCloze;
	let inputValues: string[];

	let singleInputForWholeCard: boolean;
	let valueForWholeCard: string | undefined;

	let revealedScore: Score | undefined;

	$: if (card) {
		stringSplitWithCloze = splitStringWithCloze(card.back);
		inputValues = Array(stringSplitWithCloze.length).fill(undefined);
		singleInputForWholeCard = !hasSomethingToReveal(card);
	}

	async function submit() {
		status = 'submitting';
		revealedScore = getScore();
		await onSubmit(revealedScore);
		status = 'revealed';
	}

	function goToNext() {
		status = 'init';
		valueForWholeCard = undefined;
		revealedScore = undefined;
		onNext();
	}

	const SCORE_MAP = {
		equal: 3,
		'only-different-accents': 2,
		different: 1
	};

	const notNull = (score: number | null): score is number => {
		return score !== null;
	};

	function getScore() {
		if (singleInputForWholeCard) {
			const result = compareTextLoosely(valueForWholeCard, card.back);
			return SCORE_MAP[result] as Score;
		} else {
			return Math.min(
				...stringSplitWithCloze
					.map((piece, index) => {
						if (piece.type === 'cloze') {
							const result = compareTextLoosely(inputValues[index], piece.content);
							return SCORE_MAP[result];
						} else {
							return null;
						}
					})
					.filter(notNull)
			) as Score;
		}
	}
</script>

<Container>
	<div class="mt-2 card bg-base-100 shadow-xl">
		<div class="card-body p-4 gap-4 sm:p-8 sm:gap-8">
			<div class="card-actions justify-center flex-nowrap h-24 sm:h-32">
				{#if status === 'init'}
					<button
						type="button"
						class="btn btn-primary btn-outline text-lg py-4 sm:text-xl sm:py-8 w-full h-full"
						on:click={submit}>Check the answer</button
					>
				{:else if status === 'revealed'}
					<button
						type="button"
						class="btn btn-primary btn-outline text-lg py-4 sm:text-xl sm:py-8 w-full h-full"
						on:click={goToNext}>Next question</button
					>
				{/if}
			</div>

			<div class="mt-4 flex flex-col gap-3">
				<div class="badge badge-outline">Front</div>
				<div class="text-xl sm:text-2xl">
					{@html card.front.split('\n').join('<br />')}
				</div>
				<hr />
				<div class="badge badge-outline">Back</div>
				<div class="text-xl sm:text-2xl">
					{#if singleInputForWholeCard}
						<textarea class="textarea textarea-bordered w-full" bind:value={valueForWholeCard} />
					{:else}
						{#each stringSplitWithCloze as item, index (index)}
							{#if item.type === 'text'}
								<span>{@html item.content.split('\n').join('<br />')}</span>
							{:else if item.type === 'cloze'}
								<AutoResizingInput
									onInput={(text) => {
										inputValues[index] = text;
									}}
								/>
							{/if}
						{/each}
					{/if}
				</div>

				{#if status === 'revealed'}
					{#if revealedScore === 3}
						<div class="badge badge-lg badge-success">Correct</div>
					{:else if revealedScore === 2}
						<div class="badge badge-lg badge-warning">Wrong accents</div>
					{:else if revealedScore === 1}
						<div class="badge badge-lg badge-error">Wrong</div>
					{/if}
					<div class="text-xl sm:text-2xl">
						{#each stringSplitWithCloze as item, index (index)}
							{#if item.type === 'text'}
								<span>{@html item.content.split('\n').join('<br />')}</span>
							{:else if item.type === 'cloze'}
								<span class="font-bold">{@html item.content.split('\n').join('<br />')}</span>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</Container>
