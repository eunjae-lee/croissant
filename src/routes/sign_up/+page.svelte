<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let email: string;
	let password: string;
	let status: 'init' | 'submitting' | 'confirming' | 'error' = 'init';
	let errorMessage: string;

	async function onSubmit() {
		status = 'submitting';
		const { data: signUpResult, error } = await data.supabase.auth.signUp({
			email,
			password
		});
		if (error) {
			status = 'error';
			errorMessage = error.message;
		} else {
			status = 'confirming';
		}
	}
</script>

<MetaTags title="Sign Up | Croissant" />

<div class="navbar">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">🥐</a>
	</div>
</div>

<div class="flex flex-col items-center">
	<form class="card w-96 bg-base-100 shadow-xl" on:submit|preventDefault={onSubmit}>
		<div class="card-body">
			<h2 class="card-title">Welcome to 🥐</h2>
			<input
				type="text"
				placeholder="Email"
				class="mt-4 input input-bordered w-full max-w-xs"
				bind:value={email}
				required
			/>
			<input
				type="password"
				placeholder="Password"
				class="input input-bordered w-full max-w-xs"
				bind:value={password}
				required
				minlength="12"
			/>
			<div class="card-actions justify-center">
				<button
					type="submit"
					class="btn btn-primary"
					class:loading={status === 'submitting'}
					disabled={status !== 'init'}>Sign Up</button
				>
			</div>
			<a href="/sign_in" class="link link-info text-center">(If you've signed up)</a>
		</div>
	</form>

	{#if status === 'confirming'}
		<div class="mt-4 w-96 alert alert-success shadow-lg">
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>A confirmation email has been sent! Please check your email.</span>
			</div>
		</div>
	{/if}

	{#if status === 'error' && errorMessage}
		<div class="mt-4 w-96 alert alert-error shadow-lg">
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>Something went wrong. We're looking into it. ({errorMessage})</span>
			</div>
		</div>
	{/if}
</div>
