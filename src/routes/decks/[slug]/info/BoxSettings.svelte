<script lang="ts">
	import { z } from 'zod';
	import { thize } from '$lib/utils';
	import { boxSettingsSchema } from '$lib/schemas';
	import type { Deck } from '$lib/types';
	import { Package } from 'lucide-svelte';
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let deck: Deck;
	export let supabase: SupabaseClient;

	let boxSettings = boxSettingsSchema.parse(JSON.parse(deck.box_settings!));
	$: numberOfBoxes = boxSettings.intervals.length;

	let isSubmitting: boolean = false;

	function updateBoxNumber(event: Event) {
		const result = z
			.number()
			.positive()
			.safeParse(Number((event.target as HTMLInputElement).value));
		if (!result.success) {
			return;
		}
		const newNumber = result.data;
		if (boxSettings.intervals.length < newNumber) {
			boxSettings.intervals.push(...Array(newNumber - boxSettings.intervals.length));
			boxSettings = {
				...boxSettings,
				intervals: boxSettings.intervals
			};
		} else if (boxSettings.intervals.length > newNumber) {
			boxSettings = { ...boxSettings, intervals: boxSettings.intervals.slice(0, newNumber) };
		} else {
			return;
		}
	}

	function updateInterval(event: Event, index: number) {
		const result = z
			.number()
			.gte(0)
			.safeParse(Number((event.target as HTMLInputElement).value));
		if (!result.success) {
			return;
		}
		boxSettings.intervals[index] = result.data;
		boxSettings = { ...boxSettings, intervals: boxSettings.intervals };
	}

	async function submit() {
		isSubmitting = true;
		const validationResult = boxSettingsSchema.safeParse(boxSettings);
		if (validationResult.success) {
			const { data, error } = await supabase
				.from('decks')
				.update({
					box_settings: JSON.stringify(boxSettings)
				})
				.eq('id', deck.id);

			if (error) {
				toastStore.trigger({
					message: `Failed to save it.`,
					timeout: 1500,
					background: 'variant-filled-error'
				});
				console.log('💡 update error', error);
			} else {
				toastStore.trigger({
					message: `Successfully saved.`,
					timeout: 1500,
					background: 'variant-filled-success'
				});
			}
		} else {
			toastStore.trigger({
				message: `Failed to save it.`,
				timeout: 1500,
				background: 'variant-filled-error'
			});
			console.log('💡 validation result', validationResult);
		}
		isSubmitting = false;
	}
</script>

<h2 class="text-xl flex items-center gap-2">
	<span>Box Settings</span>
	<span class="badge variant-ghost">advanced</span>
</h2>
<form on:submit|preventDefault={submit}>
	<div class="mt-4 space-y-8">
		<div class="space-y-4">
			<p>
				Croissant's algorithm is based on the <a
					href="https://en.wikipedia.org/wiki/Leitner_system"
					target="_blank"
					rel="noopener noreferrer">Leitner system</a
				> to determine when to practice which cards.
			</p>
			<p>
				It's a spaced repetition method using flashcards in boxes. You will review cards at
				increasing intervals, moving them up as you master them. Once the correct answer is given
				for the card in the last box, we will mark it as completed and it will no longer be asked.
			</p>
		</div>

		<div>
			<label class="label flex items-center">
				<Package size={18} class="mt-1" />
				<span class="ml-2 shrink-0">Number of boxes</span>
				<input
					class="ml-4 input w-24"
					type="number"
					value={numberOfBoxes}
					on:input={updateBoxNumber}
					required
				/>
			</label>
		</div>

		<div class="space-y-2">
			{#each boxSettings.intervals as interval, index}
				<div class="input-group input-group-divider grid-cols-[auto_5rem_4rem]">
					<div class="input-group-shim">Practice {thize(index + 1)} box every</div>
					<input
						type="number"
						style="min-width: unset !important"
						value={interval}
						on:input={(event) => updateInterval(event, index)}
						required
					/>
					<div class="input-group-shim">days</div>
				</div>
			{/each}
		</div>

		<div>
			<div class="space-y-2">
				<label class="flex items-center space-x-2">
					<input
						class="radio"
						type="radio"
						value="back"
						name="when_wrong"
						bind:group={boxSettings.when_wrong}
					/>
					<p>Incorrect answers are only moved back by one box</p>
				</label>
				<img src="/Leitner_system.svg.png" alt="Incorrect answers are only moved back by one box" />
			</div>
			<div class="mt-2 space-y-2">
				<label class="flex items-center space-x-2">
					<input
						class="radio"
						type="radio"
						value="to_first"
						name="when_wrong"
						bind:group={boxSettings.when_wrong}
					/>
					<p>Incorrectly answered cards return to the first box</p>
				</label>
				<img
					src="/440px-Leitner_system_alternative.svg.png"
					alt="Incorrectly answered cards return to the first box"
				/>
			</div>
		</div>
	</div>
	<div>
		<button type="submit" class="w-full btn variant-soft-primary" disabled={isSubmitting}
			>Save Box Settings</button
		>
	</div>
</form>
