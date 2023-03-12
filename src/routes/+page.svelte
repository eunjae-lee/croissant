<script lang="ts">
	import type { PageData } from './$types';
	import { Globe, Twitter, Youtube } from 'lucide-svelte';

	export let data: PageData;

	let { supabase, session } = data;

	$: if (data.session) {
		// loadData();
	}
</script>

<div class="navbar">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">🥐</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<!-- <li><a>Item 1</a></li>
			<li tabindex="0">
				<a>
					Parent
					<svg
						class="fill-current"
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg
					>
				</a>
				<ul class="p-2 bg-base-100">
					<li><a>Submenu 1</a></li>
					<li><a>Submenu 2</a></li>
				</ul>
			</li> -->
			{#if data.session}
				<li><a href="/decks">Decks</a></li>
			{:else}
				<li><a href="/sign_in">Sign In</a></li>
			{/if}
		</ul>
	</div>
</div>

<div class="hero">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">🥐 Croissant</h1>
			<p class="mt-12 text-lg">
				Maximize your study sessions with Croissant - the simple flash card app featuring spaced
				repetition algorithm!
			</p>
			<div class="mt-2 text-sm">
				We also provide REST APIs to create cards for those who are tech-savvy.
			</div>
			<a href="/sign_up" class="mt-6 btn btn-lg btn-primary">Get Started</a>
		</div>
	</div>
</div>

<footer class="fixed bottom-0 footer items-center p-4 flex justify-between">
	<div class="items-center grid-flow-col">
		<span class="text-lg">🥐</span>
		<p>Copyright © {new Date().getFullYear()}</p>
	</div>
	<div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
		<a class="hover:opacity-75" href="https://eunjae.dev"><Globe /></a>
		<a class="hover:opacity-75" href="https://twitter.com/eunjae-lee"><Twitter /></a>
		<a class="hover:opacity-75" href="https://youtube.com/@learnwitheunjae"><Youtube /></a>
	</div>
</footer>

<style>
	.hero {
		height: calc(100vh - 8rem);
	}
</style>
