<script lang="ts">
	import Confetti from 'js-confetti';
	import type { Card, Score } from '$lib/types';
	import { hasSomethingToReveal } from '$lib/utils';
	import CardWithBlur from './CardWithBlur.svelte';
	import Container from './Container.svelte';
	import { CheckCircle, HelpCircle, Slash } from 'lucide-svelte';

	export let card: Card;
	export let onNext: () => void;
	export let onSubmit: (score: Score) => Promise<void>;

	let status: 'init' | 'opened' | 'revealed' | 'submitting' = 'init';

	async function submit(score: Score) {
		status = 'submitting';
		await onSubmit(score);
		status = 'init';
		onNext();
	}
</script>

<Container>
	<div class="mt-2 card py-4">
		<header class="card-header flex justify-center gap-2 sm:gap-4 flex-nowrap h-24 sm:h-32">
			{#if status === 'init'}
				<button
					type="button"
					class="btn btn-lg sm:btn-xl variant-ghost-primary w-full h-full"
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
					class="btn btn-lg sm:btn-xl variant-ghost-primary w-full h-full"
					on:click={() => {
						status = 'revealed';
					}}>Reveal the blank(s)</button
				>
			{/if}
			{#if status === 'revealed' || status === 'submitting'}
				<button
					type="button"
					class="basis-1/3 btn sm:btn-xl variant-ghost-error h-full"
					on:click={() => submit(1)}
					disabled={status === 'submitting'}><Slash /></button
				>
				<button
					type="button"
					class="basis-1/3 btn sm:btn-xl variant-ghost-warning h-full"
					on:click={() => submit(2)}
					disabled={status === 'submitting'}><HelpCircle /></button
				>
				<button
					type="button"
					class="basis-1/3 btn sm:btn-xl variant-ghost-success h-full"
					on:click={() => {
						new Confetti().addConfetti({ confettiNumber: 20 });
						submit(3);
					}}
					disabled={status === 'submitting'}><CheckCircle /></button
				>
			{/if}
		</header>
		<section class="mt-4 p-4">
			<CardWithBlur {card} {status} />
		</section>
	</div>
</Container>
