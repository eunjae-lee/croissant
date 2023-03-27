<script lang="ts">
	const TEXT_TO_PREPEND = `I speak English and I'm learning French. `;
	const TEXT_TO_APPEND = `Transform them into a JSON array containing \`front\` and \`back\` keys. Put the original sentence in \`front\`, and the translated one in \`back\`. For \`back\`, wrap one or two key words in \`{{...}}\`.`;

	export let texts: string[] = [];

	function copy() {
		navigator.clipboard.writeText([TEXT_TO_PREPEND, ...texts, TEXT_TO_APPEND].join('\n\n'));
	}
</script>

<div class="border border-base-content rounded-md py-2 px-4 relative">
	<div class="flex flex-col sm:flex-row">
		<div class="text-sm">
			<p>{TEXT_TO_PREPEND}</p>
			{#each texts as text}
				<p>{text}</p>
			{/each}
			<p>{TEXT_TO_APPEND}</p>
		</div>
		<button type="button" class="btn btn-ghost" on:click={copy}>Copy</button>
	</div>
</div>

<style>
	:global(p) {
		@apply my-2;
	}
</style>
