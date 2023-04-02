<script lang="ts">
	import hotkeys from 'hotkeys-js';
	import { MetaTags } from 'svelte-meta-tags';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import Container from '$lib/components/Container.svelte';
	import { AppShell, toastStore } from '@skeletonlabs/skeleton';

	export let data: PageData;

	let front: string;
	let back: string;
	let status: 'init' | 'submitting' | 'error' = 'init';

	let frontElem: HTMLTextAreaElement;
	let backElem: HTMLTextAreaElement;

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
			toastStore.trigger({
				message: `Error occured. We're looking into it.`,
				timeout: 1500,
				background: 'variant-filled-error'
			});
		} else {
			status = 'init';
			front = '';
			back = '';
			toastStore.trigger({
				message: 'Card added successfully.',
				timeout: 1500,
				background: 'variant-filled-success'
			});
			frontElem.focus();
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

<AppShell>
	<svelte:fragment slot="header">
		<NavBar deck={data.deck} />
	</svelte:fragment>

	<div class="my-8">
		<Container>
			<h2 class="unstyled mb-8 text-primary-700">[{data.deck.name}] Add Card</h2>
			<form class="card w-full bg-base-100 shadow-xl" on:submit|preventDefault={onSubmit}>
				<div class="card-body p-4 gap-4 sm:p-8 sm:gap-8">
					<div class="badge variant-ghost">Front</div>
					<textarea
						bind:this={frontElem}
						class="mt-2 textarea text-xl sm:text-3xl sm:p-4"
						placeholder="Front"
						rows={4}
						bind:value={front}
						required
					/>
					<div class="mt-4 badge variant-ghost">Back</div>
					<textarea
						bind:this={backElem}
						class="mt-2 textarea text-xl sm:text-3xl sm:p-4"
						placeholder="Back"
						rows={4}
						bind:value={back}
						required
					/>
					<div class="card-actions justify-center">
						<button
							type="submit"
							class="btn btn-lg sm:btn-xl variant-filled-primary w-full mt-4 sm:mt-8 py-4 sm:py-6"
							class:loading={status === 'submitting'}
							disabled={status === 'submitting'}>Add</button
						>
					</div>
				</div>
			</form>
			<div class="mt-4 flex justify-between">
				<a href="./add-json" class="btn variant-soft">Add JSON</a>
				<a href="./play" class="btn variant-soft">Play cards ?</a>
			</div>
		</Container>
	</div>
</AppShell>
