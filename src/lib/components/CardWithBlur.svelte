<script lang="ts">
	import type { Card } from '$lib/types';
	import { hasSomethingToReveal, splitStringWithCloze } from '$lib/utils';

	export let card: Card;
	export let status: 'init' | 'opened' | 'revealed' | 'submitting';

	$: stringSplitWithCloze = splitStringWithCloze(card.back);
</script>

<div class="flex flex-col gap-3">
	<div><span class="badge variant-ghost">Front</span></div>
	<div class="ml-1 text-xl sm:text-2xl">
		{@html card.front.split('\n').join('<br />')}
	</div>
	<hr class="my-4 !border-t-2 !border-dashed" />
	<div><span class="badge variant-ghost">Back</span></div>
	<div class="text-xl sm:text-2xl" class:blur-md={status === 'init'}>
		{#if hasSomethingToReveal(card)}
			{#if status === 'revealed'}
				{#each stringSplitWithCloze as item}
					{#if item.type === 'text' || item.type === 'cloze'}
						<span>{@html item.content.split('\n').join('<br />')}</span>
					{/if}
				{/each}
			{:else}
				{#each stringSplitWithCloze as item}
					{#if item.type === 'text'}
						<span>{@html item.content.split('\n').join('<br />')}</span>
					{:else if item.type === 'cloze'}
						<span class="blur-md">{@html item.content.split('\n').join('<br />')}</span>
					{/if}
				{/each}
			{/if}
		{:else}
			{card.back}
		{/if}
	</div>
</div>
