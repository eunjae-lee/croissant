<script lang="ts">
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { MetaTags } from 'svelte-meta-tags';
	import type { PageData } from './$types';
	import { Globe, Twitter, Youtube } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';
	import Logo from '$lib/components/Logo.svelte';

	export let data: PageData;

	let redirectedFromAuthentication = $page.url.hash.startsWith('#access_token=');

	onMount(() => {
		if (redirectedFromAuthentication && location.hash === '') {
			redirect(303, '/decks');
		}
	});
</script>

<MetaTags
	title="Croissant"
	description="The simple flash card app featuring spaced repetition algorithm."
/>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar
			background="bg-surface-200"
			gridColumns="grid-cols-3"
			slotDefault="place-self-center"
			slotTrail="place-content-end"
			><svelte:fragment slot="lead">
				<div class="ml-2">
					<Logo />
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<ul class="flex gap-2 sm:gap-4 px-1">
					{#if data.session}
						<li><a class="btn variant-soft-secondary" href="/decks">Decks</a></li>
					{:else}
						<li><a class="btn variant-soft-secondary" href="/sign_in">Sign In</a></li>
					{/if}
				</ul>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="w-full h-full flex justify-center items-center">
		<div class="max-w-md mx-4 mt-[-20%] sm:mt-[-10%]">
			<p class="unstyled text-2xl">
				Maximize your study with Croissant - the simple flash card app featuring spaced repetition
				algorithm!
			</p>
			<p class="mt-4 unstyled text-lg opacity-50">
				We also provide REST APIs to create cards for those who are tech-savvy.
			</p>
			<div class="flex justify-center mt-10">
				<a href="/sign_up" class="btn btn-xl variant-filled-primary">Get Started</a>
			</div>
		</div>
	</div>

	<svelte:fragment slot="footer">
		<div class="flex justify-between py-2 px-4">
			<div class="flex items-center">
				<Logo size="sm" />
				<p class="ml-2">Copyright © {new Date().getFullYear()}</p>
			</div>
			<div class="flex">
				<a class="btn btn-sm !bg-transparent" href="https://eunjae.dev"><Globe /></a>
				<a class="btn btn-sm !bg-transparent" href="https://twitter.com/eunjae-lee"><Twitter /></a>
				<a class="btn btn-sm !bg-transparent" href="https://youtube.com/@learnwitheunjae"
					><Youtube /></a
				>
			</div>
		</div>
	</svelte:fragment>
</AppShell>
