<script lang="ts">
	import { Copy, CheckCheck } from 'lucide-svelte';
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
	{#if status === 'copied'}
		<span class="text-xs"><CheckCheck size={16} /></span>
	{:else}
		<button type="button" on:click={copy}><Copy size={16} class="hover:opacity-75" /></button>
	{/if}
</div>
