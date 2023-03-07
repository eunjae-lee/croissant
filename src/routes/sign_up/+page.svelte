<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let email: string;
	let password: string;

	async function onSubmit() {
		const { error } = await data.supabase.auth.signUp({
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
				<button type="submit" class="btn btn-primary">Sign Up</button>
			</div>
			<a href="/sign_in" class="link link-info text-center">(If you've signed up)</a>
		</div>
	</form>
</div>
