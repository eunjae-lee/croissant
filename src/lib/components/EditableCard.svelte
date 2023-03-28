<script lang="ts">
	import type { Card } from '$lib/types';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { Trash2, ArrowUp, ArrowDown } from 'lucide-svelte';

	export let card: Card;
	export let supabase: SupabaseClient;
	export let onToast: (type: 'success' | 'failure', message: string) => void;
	export let onMoveUp: (card: Card) => void;
	export let onMoveDown: (card: Card) => void;

	async function onChange() {
		await supabase
			.from('cards')
			.update({
				front: card.front,
				back: card.back
			})
			.eq('id', card.id);
		onToast('success', 'Saved!');
	}

	async function onDelete() {
		await supabase.rpc('delete_card', { param_card_id: card.id });
		card.deleted = true;
		onToast('success', 'Deleted!');
	}
</script>

{#if !card.deleted}
	<div class="card w-full bg-base-100 shadow-lg">
		<div class="card-body py-4 px-6">
			<div class="flex justify-between items-center">
				<div class="badge badge-outline">Front {card.num_order}</div>
				<div class="flex items-center">
					<button
						type="button"
						class="btn btn-ghost opacity-50 hover:opacity-100"
						title="Move this card down"
						on:click={() => onMoveDown(card)}><ArrowDown size={16} /></button
					>
					<button
						type="button"
						class="btn btn-ghost opacity-50 hover:opacity-100"
						title="Move this card up"
						on:click={() => onMoveUp(card)}><ArrowUp size={16} /></button
					>
					<button
						type="button"
						class="btn btn-ghost opacity-50 hover:opacity-100"
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
				class="textarea textarea-bordered text-lg h-24 sm:text-xl sm:h-28"
				placeholder="Front"
				bind:value={card.front}
				on:change={onChange}
				required
			/>
			<div class="mt-4 badge badge-outline">Back</div>
			<textarea
				class="textarea textarea-bordered text-lg h-24 sm:text-xl sm:h-28"
				placeholder="Back"
				bind:value={card.back}
				on:change={onChange}
				required
			/>
		</div>
	</div>
{/if}
