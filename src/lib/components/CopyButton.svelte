<script lang="ts">
	import { Copy } from 'lucide-svelte';
	export let value: string;

	let status: 'init' | 'copied' = 'init';

	async function copy() {
		await navigator.clipboard.writeText(value);
		status = 'copied';
		setTimeout(() => {
			status = 'init';
		}, 1500);
	}
</script>

<div class="tooltip flex items-center" data-tip={status === 'init' ? 'Copy' : undefined}>
	<button type="button" on:click={copy}><Copy size={16} class="hover:opacity-75" /></button>
	{#if status === 'copied'}
		<span class="ml-2 text-xs">copied!</span>
	{/if}
</div>
