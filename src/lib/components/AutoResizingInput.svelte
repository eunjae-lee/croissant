<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let onInput: (text: string) => void;

	let value: string;

	let input: HTMLInputElement;

	// Function to resize the input based on its content
	function resizeInput() {
		if (input) {
			input.style.width = '0px'; // Reset the width before calculating the new width
			input.style.width = input.scrollWidth + 4 + 'px';
		}
	}
</script>

<input
	type="text"
	class="input input-bordered w-12 my-2 mx-1"
	bind:this={input}
	bind:value
	on:input={() => {
		onInput(value);
		resizeInput();
	}}
/>
