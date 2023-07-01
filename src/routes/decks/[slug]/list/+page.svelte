<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';
	import EditableCard from '$lib/components/EditableCard.svelte';
	import type { Card } from '$lib/types';
	import { onMount } from 'svelte';
	import { Plus, ArrowUpDown, Scaling } from 'lucide-svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	export let data: PageData;

	let cards: Card[] = [];

	let loading: boolean;
	let compact = false;

	$: console.log('cards', cards);

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

	function handleConsiderSort(event) {
		cards = event.detail.items;
	}

	async function handleFinalizeSort(event) {
		cards = event.detail.items;
		for (const [index, card] of cards.entries()) {
			const newNumOrder = cards.length - index;
			if (card.num_order !== newNumOrder) {
				await data.supabase
					.from('cards')
					.update({
						num_order: newNumOrder
					})
					.eq('id', card.id);
				card.num_order = newNumOrder;
			}
		}
	}

	onMount(loadCards);
</script>

<MetaTags title="All cards | Croissant" />

<AppShell>
	<svelte:fragment slot="header">
		<NavBar deck={data.deck} />
	</svelte:fragment>

	<div class="my-8">
		<Container>
			<div class="flex justify-between">
				<button
					type="button"
					class="btn variant-soft-primary"
					class:loading
					disabled={loading}
					on:click={addNewCard}><Plus /><span>New Card</span></button
				>

				<button type="button" class="btn variant-soft-primary" on:click={() => (compact = !compact)}
					><Scaling class="mr-2" />{compact ? 'Enlarge' : 'Compact'}</button
				>
			</div>
			<div
				use:dndzone={{
					items: cards,
					flipDurationMs: 300,
					dropTargetStyle: {
						outline: 'rgba(211, 149, 14, 0.5) solid 2px',
						borderRadius: '0.25rem',
						padding: '1rem'
					}
				}}
				on:consider={handleConsiderSort}
				on:finalize={handleFinalizeSort}
				class="scroll-wrapper mt-8 flex flex-col gap-8"
			>
				{#each cards as card, index (card.id)}
					<div animate:flip={{ duration: 300 }}>
						<EditableCard
							{card}
							supabase={data.supabase}
							{onMoveUp}
							{onMoveDown}
							isFirstCard={index === 0}
							isLastCard={index === cards.length - 1}
							{compact}
						/>
					</div>
				{/each}
			</div>
		</Container>
	</div>
</AppShell>

<style>
	.scroll-wrapper {
		height: calc(100vh - 13rem);
		overflow: scroll;
	}

	:global(#page-content) {
		overflow: hidden;
	}
</style>
