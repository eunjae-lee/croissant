<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import Container from '$lib/components/Container.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import { API_HOST } from '$lib/const';
	import type { PageData } from './$types';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import { goto } from '$app/navigation';
	import { AppShell, toastStore } from '@skeletonlabs/skeleton';
	import BoxSettings from './BoxSettings.svelte';

	export let data: PageData;

	let showingToken: boolean = false;

	$: headers = JSON.stringify(
		{
			'Content-Type': 'application/json',
			Authorization: `Bearer ${showingToken ? data.deck.token : '*********'}`
		},
		null,
		2
	);
	$: requestBody = JSON.stringify(
		{
			cards: [
				{
					front: 'Hello',
					back: 'Bonjour'
				},
				{
					front: 'See you',
					back: 'Au {{revoir}}'
				}
			]
		},
		null,
		2
	);

	function showToast(message: string) {
		toastStore.trigger({
			message,
			timeout: 1500,
			background: 'variant-filled-success'
		});
	}

	async function save() {
		await data.supabase
			.from('decks')
			.update({
				name: data.deck.name
			})
			.eq('id', data.deck.id);
		showToast('Updated!');
	}

	async function deleteDeck() {
		if (
			confirm('Do you really want to delete the deck and all the cards? You cannot restore them.')
		) {
			await data.supabase.rpc('delete_deck', { param_deck_id: data.deck.id });
			showToast('Deleted!');
			goto('/decks');
		}
	}

	async function archiveDeck() {
		if (confirm('Do you want to archive the deck?')) {
			await data.supabase.from('decks').update({ archived: true }).eq('id', data.deck.id);
			showToast('Archived!');
			goto('/decks');
		}
	}

	async function unarchiveDeck() {
		if (confirm('Do you want to unarchive the deck?')) {
			await data.supabase.from('decks').update({ archived: false }).eq('id', data.deck.id);
			showToast('Unarchived!');
			goto('/decks');
		}
	}
</script>

<MetaTags title="Info | Croissant" />

<AppShell>
	<svelte:fragment slot="header">
		<NavBar deck={data.deck} />
	</svelte:fragment>

	<div class="my-8">
		<Container>
			<div class="card p-4 sm:p-8 flex gap-4 sm:gap-8">
				<div class="space-y-24">
					<section>
						<h2 class="text-xl">Basic Information</h2>
						<div class="mt-4 flex gap-2 items-center">
							<label class="label">
								<span>Name</span>
							</label>
							<input type="text" class="input" bind:value={data.deck.name} />
							<button type="button" class="btn variant-soft-primary" on:click={save}>Save</button>
						</div>
					</section>

					<section>
						<BoxSettings deck={data.deck} supabase={data.supabase} />
					</section>

					<section>
						<h2 class="text-xl">API Reference</h2>
						<h3 class="mt-4 text-lg">Add cards to "{data.deck.name}" deck</h3>
						<p class="mt-4 text-sm">Endpoint</p>
						<div class="flex items-center gap-2">
							<div class="w-full overflow-hidden break-all">
								<pre>{API_HOST}/api/deck/{data.deck.slug}</pre>
							</div>
							<div class="mr-2">
								<CopyButton value={`${API_HOST}/api/${data.deck.slug}`} />
							</div>
						</div>
						<p class="mt-4 text-sm">Method</p>
						<div><code>POST</code></div>
						<p class="mt-4 text-sm">Headers</p>
						<div class="relative">
							<pre>{headers}</pre>
							<button
								class="btn btn-sm variant-filled-secondary absolute top-2 right-2"
								type="button"
								on:click={() => {
									showingToken = !showingToken;
								}}>{showingToken ? 'Hide token' : 'Show token'}</button
							>
						</div>
						<p class="mt-4 text-sm">Body</p>
						<div>
							<pre>{requestBody}</pre>
						</div>
					</section>

					<section>
						<h2 class="text-xl">Shortcuts</h2>
						<p class="mt-2">
							To simplify the process of adding cards, <a
								target="_blank"
								rel="noopener noreferrer"
								href="https://support.apple.com/lt-lt/guide/shortcuts/welcome/ios">Shortcuts</a
							>
							can be created on iOS or Mac. You can refer to these sample shortcuts to learn how to create
							your own. For more examples,
							<a href="https://routinehub.co/" rel="noopener noreferrer" target="_blank"
								>RoutineHub</a
							> is a helpful community resource.
						</p>
						<ul class="mt-4 ml-4">
							<li>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="https://www.icloud.com/shortcuts/ac1a9179a2dd447db363c6a0f0cefdda"
									>[Sample] Add a single flash card</a
								>
							</li>
							<li>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="https://www.icloud.com/shortcuts/517c9623ebbb4599af842b2ee5c02be4"
									>[Sample] Add multiple flash cards (Auto-translation: En → Fr)</a
								>
							</li>
						</ul>
					</section>

					<section>
						<h2 class="text-xl">Dangerous Area</h2>

						{#if !data.deck.archived}
							<p class="mt-2">You can archive this deck. You can always unarchive it.</p>
							<button type="button" class="mt-2 btn variant-filled-warning" on:click={archiveDeck}>
								Archive the deck</button
							>
						{/if}

						{#if data.deck.archived}
							<p class="mt-2">You can unarchive this deck.</p>
							<button
								type="button"
								class="mt-2 btn variant-filled-primary"
								on:click={unarchiveDeck}
							>
								Unarchive the deck</button
							>
						{/if}

						<p class="mt-8">
							This will delete the deck and all the cards inside it. You cannot restore them.
						</p>
						<button type="button" class="mt-2 btn variant-filled-error" on:click={deleteDeck}
							>Delete the deck</button
						>
					</section>
				</div>
			</div>
		</Container>
	</div>
</AppShell>
