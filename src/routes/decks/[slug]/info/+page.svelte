<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import { API_HOST } from '$lib/const';
	import type { PageData } from './$types';
	import CopyButton from '$lib/components/CopyButton.svelte';

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
</script>

<NavBar deck={data.deck} />

<div class="mt-8">
	<Container>
		<div class="card w-full bg-base-100 shadow-xl">
			<div class="card-body p-4 gap-4 sm:p-8 sm:gap-8">
				<div>
					<h2 class="text-xl">API Reference</h2>
					<h3 class="mt-4 text-lg">Add cards to "{data.deck.name}" deck</h3>
					<p class="mt-4 text-sm">Endpoint</p>
					<div class="flex items-center gap-2">
						<code>{API_HOST}/api/deck/{data.deck.slug}</code>
						<CopyButton value={`${API_HOST}/api/${data.deck.slug}`} />
					</div>
					<p class="mt-4 text-sm">Method</p>
					<div><code>POST</code></div>
					<p class="mt-4 text-sm">Headers</p>
					<div class="relative">
						<pre>{headers}</pre>
						<button
							class="btn btn-ghost btn-xs absolute top-1 right-1"
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
				</div>
			</div>
		</div>
	</Container>
</div>

<style>
	code {
		@apply border border-primary py-0 px-2 rounded-md text-info-content text-sm font-normal;
	}

	pre {
		@apply border border-primary p-2 rounded-md text-info-content text-sm font-normal;
	}
</style>
