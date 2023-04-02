<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import type { editor as Editor } from 'monaco-editor/esm/vs/editor/editor.api';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';
	import Container from '$lib/components/Container.svelte';
	import { onDestroy, onMount } from 'svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import { Accordion, AccordionItem, AppShell, toastStore } from '@skeletonlabs/skeleton';
	import { Info, Loader2 } from 'lucide-svelte';

	export let data: PageData;

	let monacoElem: HTMLDivElement;
	let editor: Editor.IStandaloneCodeEditor | undefined;

	let status: 'init' | 'submitting' | 'error' = 'init';

	function showError(message: string) {
		toastStore.trigger({
			message,
			timeout: 1500,
			background: 'variant-filled-error'
		});
	}

	async function onSubmit() {
		let validJSON = false;
		let json;
		try {
			json = JSON.parse(editor!.getValue());
			validJSON = true;
		} catch (err) {
			validJSON = false;
		}
		if (!validJSON || !Array.isArray(json)) {
			showError('Invalid JSON');
			return;
		}
		if (json.some((item) => !item.front || !item.back)) {
			showError('Every item must have `front` and `back` keys.');
			return;
		}

		status = 'submitting';
		const { error } = await data.supabase.from('cards').insert(
			json.map((item) => ({
				front: item.front,
				back: item.back,
				deck_id: data.deck.id,
				user_id: data.session!.user.id
			}))
		);
		if (error) {
			showError(`Error occured. We're looking into it.`);
		} else {
			status = 'init';
			toastStore.trigger({
				message: 'Card added successfully.',
				timeout: 1500,
				background: 'variant-filled-success'
			});
		}
	}

	onMount(async () => {
		self.MonacoEnvironment = {
			getWorker: function (_moduleId: any, label: string) {
				if (label === 'json') {
					return new jsonWorker();
				}
				return new editorWorker();
			}
		};
		const Monaco = await import('monaco-editor');
		editor = Monaco.editor.create(monacoElem, {
			value: JSON.stringify([{ front: 'Hello', back: 'Bonjour' }], null, 2),
			language: 'json'
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.dispose();
			editor = undefined;
		}
	});
</script>

<MetaTags title="Add card | Croissant" />

<AppShell>
	<svelte:fragment slot="header">
		<NavBar deck={data.deck} />
	</svelte:fragment>

	<div class="mt-8">
		<Container>
			<Accordion>
				<AccordionItem>
					<svelte:fragment slot="lead"><Info /></svelte:fragment>
					<svelte:fragment slot="summary">Basic Instruction</svelte:fragment>
					<svelte:fragment slot="content">
						<p>Enter a JSON string containing an array of items with `front` and `back` keys.</p>
						<pre class="mt-2">{@html JSON.stringify(
								[
									{ front: 'Hello', back: 'Bonjour' },
									{ front: 'See you', back: 'Au {{revoir}}' }
								],
								null,
								2
							)}</pre>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem>
					<svelte:fragment slot="lead"><Info /></svelte:fragment>
					<svelte:fragment slot="summary">Using Generative AI (e.g. ChatGPT)</svelte:fragment>
					<svelte:fragment slot="content"
						><p>
							If you're using generative AI like <a
								href="https://chat.openai.com/"
								target="_blank"
								rel="noopener noreferrer">ChatGPT</a
							>, you can ask it to generate JSON for you. The example prompts are like the
							following.
						</p>
						<div class="flex flex-col gap-4">
							<Prompt texts={[`Write me 5 sentences I can use in a café at an A2 level.`]} />
							<Prompt
								texts={[
									`Pick 3 basic verbs, and give me total 24 examples by mixing different subjects with those verbs in present tense.`
								]}
							/>
							<Prompt
								texts={[
									`I'm about to call a real-estate agency to look for an apartment. Give me 5 basic sentences that I could use.`
								]}
							/>
						</div></svelte:fragment
					>
				</AccordionItem>
			</Accordion>

			<form class="mt-8 card" on:submit|preventDefault={onSubmit}>
				<div class="card-body p-4 gap-4 sm:p-8 sm:gap-8 relative">
					<div bind:this={monacoElem} class="w-full h-96" />
					{#if !editor}
						<div class="loader-wrapper">
							<Loader2 />
						</div>
					{/if}
					<div class="card-actions justify-center">
						<button
							type="submit"
							class="mt-4 btn btn-lg sm:btn-xl variant-soft-primary w-full"
							class:loading={status === 'submitting'}
							disabled={status === 'submitting'}>Add JSON</button
						>
					</div>
				</div>
			</form>
			<div class="mt-4 flex justify-between">
				<a href="./add" class="btn variant-soft">Add card</a>
				<a href="./play" class="btn variant-soft">Play cards ?</a>
			</div>
		</Container>
	</div>
</AppShell>

<style>
	.loader-wrapper {
		@apply absolute animate-spin text-primary-500;
		top: calc(50% - 3rem);
		left: calc(50% - 1rem);
	}
</style>
