<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	// console.log('💡 subjects data', data);
</script>

<NavBar />

<div class="m-6">subjects!</div>
