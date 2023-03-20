<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';
	import EditableCard from '$lib/components/EditableCard.svelte';
	import type { Card } from '$lib/types';

	export let data: PageData;

	let showSuccessToast: boolean;
	let showErrorToast: boolean;

	let editedCards: Record<string, Card> = {};

	let saving: boolean = false;

	function onChange(card: Card) {
		editedCards[card.id] = card;
	}

	async function saveAll() {
		saving = true;
		await Promise.all(
			Object.values(editedCards).map((card) =>
				data.supabase
					.from('cards')
					.update({
						front: card.front,
						back: card.back
					})
					.eq('id', card.id)
			)
		);
		saving = false;
		editedCards = {};
	}
</script>

<MetaTags title="All cards | Croissant" />

<NavBar deck={data.deck} />

<div class="mt-8">
	<Container>
		<div class="sticky top-8 flex justify-end z-10">
			<button
				type="button"
				class="btn btn-primary"
				class:loading={saving}
				disabled={Object.keys(editedCards).length === 0 || saving}
				on:click={saveAll}>Save All</button
			>
		</div>
		<div class="my-8 flex flex-col gap-8">
			{#each data.cards as card (card.id)}
				<EditableCard {card} {onChange} edited={Boolean(editedCards[card.id])} />
			{/each}
		</div>
	</Container>

	{#if showSuccessToast}
		<div class="mt-12 toast toast-top toast-end">
			<div class="alert alert-success">
				<div>
					<span>Card added successfully.</span>
				</div>
			</div>
		</div>
	{/if}

	{#if showErrorToast}
		<div class="mt-12 toast toast-top toast-end">
			<div class="alert alert-error">
				<div>
					<span>Error occured. We're looking into it.</span>
				</div>
			</div>
		</div>
	{/if}
</div>
