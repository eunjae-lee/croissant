<script lang="ts">
	import { Info } from 'lucide-svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { Deck } from '$lib/types';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';

	export let data: PageData;
	let decks: Deck[] = [];
	let status: 'init' | 'loaded';

	async function loadDecks() {
		const { data: result } = await data.supabase.from('decks').select('*');
		decks = result || [];
		status = 'loaded';
	}

	async function createDeck() {
		const name = prompt('What is the name of the new deck?');
		if (!name) {
			alert('Please enter a valid deck name.');
			return;
		}
		await data.supabase.from('decks').insert({
			name,
			user_id: data.session!.user.id
		});
		await loadDecks();
	}

	loadDecks();
</script>

<NavBar />

<div class="mt-8">
	<Container>
		<div class="grid gap-8 md:grid-cols-2">
			{#each decks as deck (deck.id)}
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body justify-between h-48">
						<h2 class="card-title">{deck.name}</h2>
						<div class="card-actions justify-end">
							<a href={`/decks/${deck.slug}/info`} class="btn btn-ghost"><Info /></a>
							<a href={`/decks/${deck.slug}/add`} class="btn btn-secondary">Add Cards</a>
							<a href={`/decks/${deck.slug}/play`} class="btn btn-primary">Play Quiz</a>
						</div>
					</div>
				</div>
			{/each}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body justify-between h-48">
					{#if status === 'loaded' && decks.length === 0}
						<h2 class="card-title">Create your first deck</h2>
					{:else}
						<h2 class="card-title text-lg font-normal">Want to learn something else?</h2>
					{/if}
					<div class="card-actions justify-end">
						<button class="btn btn-primary" on:click={createDeck}>Create a deck</button>
					</div>
				</div>
			</div>
		</div>
	</Container>
</div>
