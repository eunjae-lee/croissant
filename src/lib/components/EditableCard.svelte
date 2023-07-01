<script lang="ts">
	import type { Card } from '$lib/types';
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { Trash2, ArrowUp, ArrowDown } from 'lucide-svelte';

	export let card: Card;
	export let supabase: SupabaseClient;
	export let onMoveUp: (card: Card) => void;
	export let onMoveDown: (card: Card) => void;
	export let isFirstCard: boolean;
	export let isLastCard: boolean;
	export let compact: boolean;

	async function onChange() {
		await supabase
			.from('cards')
			.update({
				front: card.front,
				back: card.back
			})
			.eq('id', card.id);
		toastStore.trigger({
			message: 'Saved!',
			timeout: 1500,
			background: 'variant-filled-success'
		});
	}

	async function onDelete() {
		await supabase.rpc('delete_card', { param_card_id: card.id });
		card.deleted = true;
		toastStore.trigger({
			message: 'Deleted!',
			timeout: 1500,
			background: 'variant-filled-success'
		});
	}
</script>

{#if !card.deleted}
	<div
		class="card"
		class:py-4={!compact}
		class:px-6={!compact}
		class:py-2={compact}
		class:px-3={compact}
	>
		<div class="flex justify-between items-center">
			<div class="badge variant-ghost">Front</div>
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="btn variant-soft"
					title="Move this card up"
					disabled={isFirstCard}
					on:click={() => onMoveUp(card)}><ArrowUp size={16} /></button
				>
				<button
					type="button"
					class="btn variant-soft"
					title="Move this card down"
					disabled={isLastCard}
					on:click={() => onMoveDown(card)}><ArrowDown size={16} /></button
				>
				<button
					type="button"
					class="btn variant-soft"
					title="Delete this card"
					on:click={() => {
						if (confirm('Delete this card?')) {
							onDelete();
						}
					}}><Trash2 size={16} /></button
				>
			</div>
		</div>
		<textarea
			class="mt-2 textarea"
			class:text-lg={!compact}
			class:sm:text-xl={!compact}
			placeholder="Front"
			rows={compact ? 1 : 4}
			bind:value={card.front}
			on:change={onChange}
			required
		/>
		<div class="badge variant-ghost" class:mt-6={!compact} class:mt-2={compact}>Back</div>
		<textarea
			class="mt-3 textarea"
			class:text-lg={!compact}
			class:sm:text-xl={!compact}
			placeholder="Back"
			rows={compact ? 1 : 4}
			bind:value={card.back}
			on:change={onChange}
			required
		/>
	</div>
{/if}
