<script lang="ts">
	import type { Card } from '$lib/types';
	import { hasSomethingToReveal, splitStringWithCloze } from '$lib/utils';

	export let card: Card;
	export let status: 'init' | 'opened' | 'revealed' | 'submitting';

	$: stringSplitWithCloze = splitStringWithCloze(card.back);
</script>

<div class="mt-4 flex flex-col gap-3">
	<div class="badge badge-outline">Front</div>
	<div class="text-xl sm:text-2xl">
		{card.front}
	</div>
	<hr />
	<div class="badge badge-outline">Back</div>
	<div class="text-xl sm:text-2xl" class:blur-md={status === 'init'}>
		{#if hasSomethingToReveal(card)}
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
