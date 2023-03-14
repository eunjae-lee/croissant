<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
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

<MetaTags title="Info | Croissant" />

<NavBar deck={data.deck} />

<div class="mt-8">
	<Container>
		<div class="card w-full bg-base-100 shadow-xl mb-16 pt-4 pb-8">
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
					<h2 class="mt-8 text-xl">Shortcuts</h2>
					<p class="mt-2">
						To simplify the process of adding cards, <a
							target="_blank"
							rel="noopener noreferrer"
							href="https://support.apple.com/lt-lt/guide/shortcuts/welcome/ios">Shortcuts</a
						>
						can be created on iOS or Mac. You can refer to these sample shortcuts to learn how to create
						your own. For more examples,
						<a href="https://routinehub.co/" rel="noopener noreferrer" target="_blank">RoutineHub</a
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
				</div>
			</div>
		</div>
	</Container>
</div>

<style>
	a {
		@apply text-primary underline hover:opacity-75;
	}

	ul {
		@apply list-disc;
	}

	code {
		@apply border border-primary py-0 px-2 rounded-md text-info-content text-sm font-normal;
	}

	pre {
		@apply border border-primary p-2 rounded-md text-info-content text-sm font-normal;
	}
</style>
