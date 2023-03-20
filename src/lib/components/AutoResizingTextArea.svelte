<script lang="ts">
	export let onInput: (text: string) => void;

	let value: string;

	let textarea: HTMLTextAreaElement;

	// Function to resize the input based on its content
	function resizeInput() {
		if (textarea) {
			textarea.style.height = '0px'; // Reset the height before calculating the new width
			textarea.style.height = textarea.scrollHeight + 8 + 'px';
		}
	}
</script>

<textarea
	class="textarea textarea-bordered w-full h-14 text-2xl"
	bind:this={textarea}
	bind:value
	on:input={() => {
		onInput(value);
		resizeInput();
	}}
/>
