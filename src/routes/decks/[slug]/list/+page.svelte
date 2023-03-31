<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';
	import EditableCard from '$lib/components/EditableCard.svelte';
	import type { Card } from '$lib/types';
	import { onMount } from 'svelte';
	import { Plus } from 'lucide-svelte';
	import { AppShell } from '@skeletonlabs/skeleton';

	export let data: PageData;

	let cards: Card[] = [];

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

	async function loadCards() {
		const result = await data.supabase
			.from('cards')
			.select('*')
			.eq('deck_id', data.deck.id)
			.order('num_order', { ascending: false });
		cards = result.data || [];
	}

	async function onMoveUp(card: Card) {
		const currentIndex = cards.findIndex((c) => c.id === card.id);
		if (currentIndex === 0) {
			return;
		}
		await data.supabase.rpc('move_card', {
			param_card_id: card.id,
			param_num_after: cards[currentIndex - 1].num_order
		});

		await loadCards();
	}

	async function onMoveDown(card: Card) {
		const currentIndex = cards.findIndex((c) => c.id === card.id);
		if (currentIndex === cards.length - 1) {
			return;
		}
		await data.supabase.rpc('move_card', {
			param_card_id: card.id,
			param_num_after:
				currentIndex === cards.length - 2
					? cards[currentIndex + 1].num_order - 1
					: cards[currentIndex + 2].num_order
		});

		await loadCards();
	}

	onMount(loadCards);
</script>

<MetaTags title="All cards | Croissant" />

<AppShell>
	<svelte:fragment slot="header">
		<NavBar deck={data.deck} />
	</svelte:fragment>

	<div class="mt-8">
		<Container>
			<div class="">
				<button
					type="button"
					class="btn variant-soft-primary"
					class:loading
					disabled={loading}
					on:click={addNewCard}><Plus /><span>New Card</span></button
				>
			</div>
			<div class="my-8 flex flex-col gap-8">
				{#each cards as card, index (card.id)}
					<EditableCard
						{card}
						supabase={data.supabase}
						{onMoveUp}
						{onMoveDown}
						isFirstCard={index === 0}
						isLastCard={index === cards.length - 1}
					/>
				{/each}
			</div>
		</Container>
	</div>
</AppShell>
