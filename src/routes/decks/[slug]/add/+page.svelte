<script lang="ts">
	import hotkeys from 'hotkeys-js';
	import { MetaTags } from 'svelte-meta-tags';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import Container from '$lib/components/Container.svelte';

	export let data: PageData;

	let front: string;
	let back: string;
	let status: 'init' | 'submitting' | 'error' = 'init';

	let frontElem: HTMLTextAreaElement;
	let backElem: HTMLTextAreaElement;

	let showSuccessToast: boolean;
	let showErrorToast: boolean;

	async function onSubmit() {
		status = 'submitting';
		const { error } = await data.supabase.from('cards').insert({
			front,
			back,
			deck_id: data.deck.id,
			user_id: data.session!.user.id
		});
		if (error) {
			status = 'error';
			showErrorToast = true;
			setTimeout(() => {
				showErrorToast = false;
			}, 1500);
		} else {
			status = 'init';
			front = '';
			back = '';
			showSuccessToast = true;
			frontElem.focus();
			setTimeout(() => {
				showSuccessToast = false;
			}, 1500);
		}
	}

	onMount(() => {
		frontElem.focus();

		hotkeys.filter = function (event: Event) {
			// @ts-ignore
			var tagName = (event.target || event.srcElement).tagName;
			hotkeys.setScope(/^(TEXTAREA)$/.test(tagName) ? 'input' : 'other');
			return true;
		};
		hotkeys(
			'cmd+enter',
			{
				element: backElem
			},
			() => {
				onSubmit();
			}
		);
	});

	onDestroy(() => {
		hotkeys.unbind('cmd+enter');
	});
</script>

<MetaTags title="Add card | Croissant" />

<NavBar deck={data.deck} />

<div class="mt-8">
	<Container>
		<form class="card w-full bg-base-100 shadow-xl" on:submit|preventDefault={onSubmit}>
			<div class="card-body p-4 gap-4 sm:p-8 sm:gap-8">
				<div class="badge badge-outline">Front</div>
				<textarea
					bind:this={frontElem}
					class="textarea textarea-bordered text-xl h-24 sm:text-3xl sm:h-36"
					placeholder="Front"
					bind:value={front}
					required
				/>
				<div class="mt-4 badge badge-outline">Back</div>
				<textarea
					bind:this={backElem}
					class="textarea textarea-bordered text-xl h-24 sm:text-3xl sm:h-36"
					placeholder="Back"
					bind:value={back}
					required
				/>
				<div class="card-actions justify-center">
					<button
						type="submit"
						class="btn btn-primary w-full text-lg py-4 sm:text-2xl sm:py-8 h-[initial]"
						class:loading={status === 'submitting'}
						disabled={status === 'submitting'}>Add</button
					>
				</div>
			</div>
		</form>
		<div class="mt-4 flex justify-end">
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
					<span>Error occured. We're looking into it.</span>
				</div>
			</div>
		</div>
	{/if}
</div>
