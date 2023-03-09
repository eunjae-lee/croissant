<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	let front: string;
	let back: string;
	let status: 'init' | 'submitting' | 'error' = 'init';

	let frontElem: HTMLTextAreaElement;

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
	});
</script>

<NavBar deck={data.deck} />

<div class="mt-8 px-4 sm:px-8 flex justify-center">
	<form
		class="card w-full sm:w-[32rem] md:w-[48rem] bg-base-100 shadow-xl"
		on:submit|preventDefault={onSubmit}
	>
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
</div>

{#if showSuccessToast}
	<div class="toast toast-top toast-end">
		<div class="alert alert-success">
			<div>
				<span>Card added successfully.</span>
			</div>
		</div>
	</div>
{/if}

{#if showErrorToast}
	<div class="toast toast-top toast-end">
		<div class="alert alert-error">
			<div>
				<span>Error occured. We're looking into it.</span>
			</div>
		</div>
	</div>
{/if}
