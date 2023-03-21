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

	onMount(async () => {
		const result = await data.supabase
			.from('cards')
			.select('*')
			.eq('deck_id', data.deck.id)
			.eq('deleted', false)
			.order('created_ts', { ascending: false });
		cards = result.data || [];
	});
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
				<EditableCard {card} supabase={data.supabase} {onToast} />
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
