<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';
	import EditableCard from '$lib/components/EditableCard.svelte';
	import type { Card } from '$lib/types';
	import { onMount } from 'svelte';
	import { Plus } from 'lucide-svelte';

	export let data: PageData;

	let cards: Card[] = [];

	let toastMessage: string | undefined;
	let toastType: 'success' | 'failure';

	let loading: boolean;

	async function addNewCard() {
		loading = true;
		const result = await data.supabase
			.from('cards')
			.insert({
				front: '',
				back: '',
				deck_id: data.deck.id,
				user_id: data.deck.user_id
			})
			.select('*');
		if (result.data && result.data[0]) {
			cards = [result.data[0], ...cards];
		}
		loading = false;
		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 100);
	}

	function onToast(type: 'success' | 'failure', message: string) {
		toastMessage = message;
		toastType = type;

		setTimeout(() => {
			toastMessage = undefined;
		}, 1000);
	}

	async function loadCards() {
		const result = await data.supabase
			.from('cards')
			.select('*')
			.eq('deck_id', data.deck.id)
			.order('num_order');
		cards = result.data || [];
	}

	async function onMoveUp(card: Card) {
		const currentIndex = cards.findIndex((c) => c.id === card.id);
		if (currentIndex === 0) {
			return;
		}
		const targetOrder =
			currentIndex === 1 ? cards[0].num_order - 1 : cards[currentIndex - 2].num_order;
		await data.supabase.rpc('move_card', {
			param_card_id: card.id,
			param_num_after: targetOrder
		});

		await loadCards();
	}

	async function onMoveDown(card: Card) {
		const currentIndex = cards.findIndex((c) => c.id === card.id);
		if (currentIndex === cards.length - 1) {
			return;
		}
		const targetOrder = cards[currentIndex + 1].num_order;
		await data.supabase.rpc('move_card', {
			param_card_id: card.id,
			param_num_after: targetOrder
		});

		await loadCards();
	}

	onMount(loadCards);
</script>

<MetaTags title="All cards | Croissant" />

<NavBar deck={data.deck} />

<div class="mt-8">
	<Container>
		<div class="sticky top-8 flex z-10">
			<button
				type="button"
				class="btn btn-outline btn-primary"
				class:loading
				disabled={loading}
				on:click={addNewCard}><Plus /><span>New Card</span></button
			>
		</div>
		<div class="my-8 flex flex-col gap-8">
			{#each cards as card (card.id)}
				<EditableCard {card} supabase={data.supabase} {onToast} {onMoveUp} {onMoveDown} />
			{/each}
		</div>
	</Container>

	{#if toastMessage}
		<div class="mt-12 toast toast-top toast-end">
			<div
				class="alert"
				class:alert-success={toastType === 'success'}
				class:alert-error={toastType === 'failure'}
			>
				<div>
					<span>{toastMessage}</span>
				</div>
			</div>
		</div>
	{/if}
</div>
