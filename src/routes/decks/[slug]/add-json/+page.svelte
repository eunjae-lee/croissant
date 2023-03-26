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

	export let data: PageData;

	let monacoElem: HTMLDivElement;
	let editor: Editor.IStandaloneCodeEditor | undefined;

	let status: 'init' | 'submitting' | 'error' = 'init';

	let showSuccessToast: boolean;
	let showErrorToast: boolean;
	let errorMessage: string | undefined;

	function showError(message?: string) {
		errorMessage = message;
		showErrorToast = true;
		setTimeout(() => {
			errorMessage = undefined;
			showErrorToast = false;
		}, 3000);
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
			showSuccessToast = true;
			setTimeout(() => {
				showSuccessToast = false;
			}, 1500);
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

<NavBar deck={data.deck} />

<div class="mt-8">
	<Container>
		<details>
			<summary>Basic Instruction</summary>
			<div>
				<p>Enter a JSON string containing an array of items with `front` and `back` keys.</p>
				<code>
					<pre class="mt-2">{@html JSON.stringify(
							[
								{ front: 'Hello', back: 'Bonjour' },
								{ front: 'See you', back: 'Au {{revoir}}' }
							],
							null,
							2
						)}</pre>
				</code>
			</div>
		</details>

		<details>
			<summary>Using Generative AI (e.g. ChatGPT)</summary>
			<div>
				<p>
					If you're using generative AI like <a
						href="https://chat.openai.com/"
						target="_blank"
						rel="noopener noreferrer">ChatGPT</a
					>, you can ask it to generate JSON for you. The example prompts are like the following.
				</p>
				<div class="flex flex-col gap-4">
					<Prompt
						texts={[
							`I speak English and I'm learning French. Write me 5 sentences I can use in a café at an A2 level.`
						]}
					/>
					<Prompt
						texts={[
							`I speak English and I'm learning French. Pick 3 basic verbs, and give me total 24 examples by mixing different subjects with those verbs in present tense.`
						]}
					/>
					<Prompt
						texts={[
							`I speak English and I'm learning French. I'm about to call a real-estate agency to look for an apartment. Give me 5 basic sentences that I could use.`
						]}
					/>
				</div>
			</div>
		</details>

		<form class="card w-full bg-base-100 shadow-xl" on:submit|preventDefault={onSubmit}>
			<div class="card-body p-4 gap-4 sm:p-8 sm:gap-8">
				<div bind:this={monacoElem} class="w-full h-96" />
				<div class="card-actions justify-center">
					<button
						type="submit"
						class="btn btn-primary w-full text-lg py-4 sm:text-2xl sm:py-8 h-[initial]"
						class:loading={status === 'submitting'}
						disabled={status === 'submitting'}>Add JSON</button
					>
				</div>
			</div>
		</form>
		<div class="mt-4 flex justify-between">
			<a href="./add" class="btn btn-ghost opacity-50 hover:opacity-100">Add card</a>
			<a href="./play" class="btn btn-ghost opacity-50 hover:opacity-100">Play cards ?</a>
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
					<span>{errorMessage}</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	details {
		@apply mb-4;
	}
	summary {
		@apply ml-2 cursor-pointer;
	}

	summary + div {
		@apply ml-2;
	}

	pre {
		@apply border border-base-content rounded-lg py-2 px-4;
	}
</style>
