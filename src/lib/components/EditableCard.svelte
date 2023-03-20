<script lang="ts">
	import type { Card } from '$lib/types';

	export let card: Card;
	export let onChange: (card: Card) => void;
	export let edited: boolean;
</script>

<div class="card w-full bg-base-100 shadow-lg">
	<div class="card-body py-4 px-6">
		<div class="flex justify-between">
			<div class="badge badge-outline">Front</div>
			{#if edited}
				<div class="badge badge-secondary text-xs">edited</div>
			{/if}
		</div>
		<textarea
			class="textarea textarea-bordered text-lg h-24 sm:text-xl sm:h-28"
			placeholder="Front"
			bind:value={card.front}
			on:input={() => onChange(card)}
			required
		/>
		<div class="mt-4 badge badge-outline">Back</div>
		<textarea
			class="textarea textarea-bordered text-lg h-24 sm:text-xl sm:h-28"
			placeholder="Back"
			bind:value={card.back}
			on:input={() => onChange(card)}
			required
		/>
	</div>
</div>
