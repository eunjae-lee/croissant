<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let email: string;
	let password: string;

	async function onSubmit() {
		const { error } = await data.supabase.auth.signInWithPassword({
			email,
			password
		});
		if (!error) {
			goto('/subjects');
		}
	}
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">🥐</a>
	</div>
</div>

<div class="flex justify-center">
	<form class="card w-96 bg-base-100 shadow-xl" on:submit|preventDefault={onSubmit}>
		<div class="card-body">
			<h2 class="card-title">Hi there 👋</h2>
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
				minlength="12"
				required
			/>
			<div class="card-actions justify-center">
				<button type="submit" class="btn btn-primary">Sign In</button>
			</div>
			<a href="/sign_up" class="link link-info text-center">(If you haven't signed up yet)</a>
		</div>
	</form>
</div>
