<script lang="ts">
	import type { Card } from '$lib/types';
	import { hasSomethingToReveal } from '$lib/utils';
	import CardWithBlur from './CardWithBlur.svelte';
	import Container from './Container.svelte';

	export let counter: string;
	export let card: Card;
	export let onNext: () => void;
	export let onSubmit: (score: 1 | 2 | 3) => Promise<void>;

	let status: 'init' | 'opened' | 'revealed' | 'submitting' = 'init';

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
								if (hasSomethingToReveal(card)) {
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
				<CardWithBlur {card} {status} />
			</div>
		</div>
	</Container>
</div>
