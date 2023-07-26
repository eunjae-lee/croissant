<script lang="ts">
	import Confetti from 'js-confetti';
	import diff from 'simple-text-diff';
	import type { Card, Score } from '$lib/types';
	import {
		compareTextLoosely,
		hasSomethingToReveal,
		splitStringWithCloze,
		type StringsSplitWithCloze,
		type TextComparisonResult
	} from '$lib/utils';
	import Container from './Container.svelte';
	import AutoResizingInput from './AutoResizingInput.svelte';
	import { onMount } from 'svelte';

	export let card: Card;
	export let onNext: () => void;
	export let onSubmit: (score: Score) => Promise<void>;

	let status: 'init' | 'submitting' | 'revealed' = 'init';

	let stringSplitWithCloze: StringsSplitWithCloze;
	let inputValues: string[];

	let inputMode: 'withCloze' | 'singleInput' = hasSomethingToReveal(card)
		? 'withCloze'
		: 'singleInput';
	let valueForWholeCard: string | undefined;

	let revealedScore: Score | undefined;
	let clozeComparisionResults: TextComparisonResult[];

	stringSplitWithCloze = splitStringWithCloze(card.back);
	clozeComparisionResults = [];
	inputValues = Array(stringSplitWithCloze.length).fill(undefined);

	let diffResult;

	async function submit() {
		status = 'submitting';
		calcScore();
		if (revealedScore === 3) {
			new Confetti().addConfetti({ confettiNumber: 20 });
		}
		await onSubmit(revealedScore!);
		status = 'revealed';

		if (inputMode === 'withCloze') {
			diffResult = undefined;
		}
		{
			diffResult = diff.diffPatch(card.back, valueForWholeCard || '');
		}
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

	function calcScore() {
		if (inputMode === 'singleInput') {
			const result = compareTextLoosely(valueForWholeCard, card.back);
			revealedScore = SCORE_MAP[result] as Score;
		} else if (inputMode === 'withCloze') {
			clozeComparisionResults = [];
			const finalScore = Math.min(
				...stringSplitWithCloze
					.map((piece, index) => {
						if (piece.type === 'cloze') {
							const result = compareTextLoosely(inputValues[index], piece.content);
							clozeComparisionResults[index] = result;
							return SCORE_MAP[result];
						} else {
							return null;
						}
					})
					.filter(notNull)
			) as Score;

			revealedScore = finalScore;
		}
	}

	let inputWrapper: HTMLDivElement;
	let inputWrapperWidth: number;

	onMount(() => {
		inputWrapperWidth = inputWrapper.clientWidth;
	});
</script>

<Container>
	<div class="mt-2 card py-4">
		<div class="card-header flex justify-center flex-nowrap h-24 sm:h-32">
			{#if status === 'init'}
				<button
					type="button"
					class="btn btn-lg sm:btn-xl variant-ghost-primary w-full h-full"
					on:click={submit}>Check the answer</button
				>
			{:else if status === 'revealed'}
				<button
					type="button"
					class="btn btn-lg sm:btn-xl variant-ghost-primary w-full h-full"
					on:click={goToNext}>Next question</button
				>
			{/if}
		</div>

		<section class="mt-4 p-4 flex flex-col gap-3">
			<div><span class="badge variant-ghost">Front</span></div>
			<div class="ml-1 text-xl sm:text-2xl">
				{@html card.front.split('\n').join('<br />')}
			</div>
			<hr class="my-4 !border-t-2 !border-dashed" />
			<div>
				<span class="badge variant-ghost">Back</span>
				{#if revealedScore === 3}
					<span class="ml-1 badge variant-ghost-success">Correct</span>
				{:else if revealedScore === 2}
					<span class="ml-1 badge variant-ghost-warning">Wrong accents</span>
				{:else if revealedScore === 1}
					<span class="ml-1 badge variant-ghost-error">Wrong</span>
				{/if}
			</div>
			<div bind:this={inputWrapper} class="text-xl sm:text-2xl">
				{#if inputMode === 'singleInput'}
					{#if status === 'revealed'}
						<div class="my-answer ml-1 text-xl sm:text-2xl">
							{@html diffResult.after}
						</div>
					{:else}
						<textarea
							class="textarea w-full text-xl sm:text-2xl"
							disabled={status !== 'init'}
							rows={4}
							bind:value={valueForWholeCard}
						/>
					{/if}
				{/if}

				{#if inputMode === 'withCloze'}
					{#each stringSplitWithCloze as item, index (index)}
						{#if item.type === 'text'}
							<span>{@html item.content.split('\n').join('<br />')}</span>
						{:else if item.type === 'cloze'}
							{#if status === 'revealed'}
								<span
									class="inline-block my-2 text-xl sm:text-2xl py-1 px-1 sm:px-2"
									class:text-error-600={clozeComparisionResults[index] === 'different'}
									class:text-warning-600={clozeComparisionResults[index] ===
										'only-different-accents'}
									class:text-success-700={clozeComparisionResults[index] === 'equal'}
									>{inputValues[index] || '_'}</span
								>
							{:else}
								<AutoResizingInput
									key={card.id}
									disabled={status !== 'init'}
									maxWidth={inputWrapperWidth - 42}
									onInput={(text) => {
										inputValues[index] = text;
									}}
								/>
							{/if}
						{/if}
					{/each}
				{/if}
			</div>

			{#if status === 'revealed'}
				<div class="my-8">
					<div class="mt-2 text-xl sm:text-2xl">
						<div class="mb-2">
							<span class="badge variant-ghost">Correct Answer</span>
						</div>
						{#if inputMode === 'singleInput'}
							<div class="correct-answer">
								{@html diffResult.before}
							</div>
						{:else if inputMode === 'withCloze'}
							{#each stringSplitWithCloze as item, index (index)}
								{#if item.type === 'text'}
									<span>{@html item.content.split('\n').join('<br />')}</span>
								{:else if item.type === 'cloze'}
									<span>{@html item.content.split('\n').join('<br />')}</span>
								{/if}
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		</section>
	</div>
</Container>

<style>
	.correct-answer :global(del) {
		@apply no-underline bg-green-300 inline-block before:content-[''] py-1 px-2 mx-2 rounded-md;
	}

	.my-answer :global(ins) {
		@apply line-through bg-red-300 inline-block before:content-[''] py-1 px-2 mx-2 rounded-md;
	}
</style>
