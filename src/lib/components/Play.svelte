<script lang="ts">
	import type { Card } from '$lib/types';
	import { splitStringWithCloze } from '$lib/utils';
	import Container from './Container.svelte';

	export let counter: string;
	export let card: Card;
	export let onNext: () => void;
	export let onSubmit: (score: 1 | 2 | 3) => Promise<void>;

	let status: 'init' | 'opened' | 'revealed' | 'submitting' = 'init';

	$: hasSomethingToReveal = /{{.+}}/.test(card.back);
	$: stringSplitWithCloze = splitStringWithCloze(card.back);

	async function submit(score: 1 | 2 | 3) {
		status = 'submitting';
		await onSubmit(score);
		status = 'init';
		onNext();
	}
</script>

<div class="mt-8">
	<Container>
		<div class="badge badge-outline">{counter}</div>
		<div class="mt-2 card bg-base-100 shadow-xl">
			<div class="card-body p-4 gap-4 sm:p-8 sm:gap-8">
				<div class="card-actions justify-center flex-nowrap h-24 sm:h-32">
					{#if status === 'init'}
						<button
							type="button"
							class="btn btn-primary btn-outline text-lg py-4 sm:text-xl sm:py-8 w-full h-full"
							on:click={() => {
								if (hasSomethingToReveal) {
									status = 'opened';
								} else {
									status = 'revealed';
								}
							}}>Open the card</button
						>
					{/if}
					{#if status === 'opened'}
						<button
							type="button"
							class="btn btn-primary btn-outline text-lg py-4 sm:text-xl sm:py-8 w-full h-full"
							on:click={() => {
								status = 'revealed';
							}}>Reveal the blank(s)</button
						>
					{/if}
					{#if status === 'revealed' || status === 'submitting'}
						<button
							type="button"
							class="basis-1/3 btn btn-ghost btn-outline text-lg py-4 sm:text-xl sm:py-8 h-full"
							on:click={() => submit(1)}
							disabled={status === 'submitting'}>Didn't know</button
						>
						<button
							type="button"
							class="basis-1/3 btn btn-secondary text-lg py-4 sm:text-xl sm:py-8 h-full"
							on:click={() => submit(2)}
							disabled={status === 'submitting'}>Maybe</button
						>
						<button
							type="button"
							class="basis-1/3 btn btn-primary text-lg py-4 sm:text-xl sm:py-8 h-full"
							on:click={() => submit(3)}
							disabled={status === 'submitting'}>Knew it</button
						>
					{/if}
				</div>
				<div class="mt-4 flex flex-col gap-3">
					<div class="badge badge-outline">Front</div>
					<div class="text-xl sm:text-2xl">
						{card.front}
					</div>
					<hr />
					<div class="badge badge-outline">Back</div>
					<div class="text-xl sm:text-2xl" class:blur-md={status === 'init'}>
						{#if hasSomethingToReveal}
							{#if status === 'revealed'}
								{#each stringSplitWithCloze as item}
									{#if item.type === 'text'}
										<span>{item.content}</span>
									{:else if item.type === 'cloze'}
										<span>{item.content}</span>
									{/if}
								{/each}
							{:else}
								{#each stringSplitWithCloze as item}
									{#if item.type === 'text'}
										<span>{item.content}</span>
									{:else if item.type === 'cloze'}
										<span class="blur-md">{item.content}</span>
									{/if}
								{/each}
							{/if}
						{:else}
							{card.back}
						{/if}
					</div>
				</div>
			</div>
		</div>
	</Container>
</div>
