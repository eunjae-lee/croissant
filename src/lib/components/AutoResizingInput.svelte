<script lang="ts">
	// manually converted from https://github.com/JedWatson/react-input-autosize/blob/master/src/AutosizeInput.js

	import { afterUpdate, onDestroy, onMount } from 'svelte';

	export let key: string;
	export let onInput: (text: string) => void;
	export let maxWidth: number | undefined = undefined;
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let autofocus: boolean = false;

	let value: string | undefined;
	let input: HTMLInputElement;
	let sizer: HTMLDivElement;
	let placeHolderSizer: HTMLDivElement;
	let mounted: boolean;
	let inputWidth: number;

	$: if (key) {
		value = undefined;
		inputWidth = 0;
	}

	const copyStyles = (styles, node) => {
		node.style.fontSize = styles.fontSize;
		node.style.fontFamily = styles.fontFamily;
		node.style.fontWeight = styles.fontWeight;
		node.style.fontStyle = styles.fontStyle;
		node.style.letterSpacing = styles.letterSpacing;
		node.style.textTransform = styles.textTransform;
	};

	function copyInputStyles() {
		if (!mounted || !window.getComputedStyle) {
			return;
		}
		const inputStyles = input && window.getComputedStyle(input);
		if (!inputStyles) {
			return;
		}
		copyStyles(inputStyles, sizer);
		if (placeHolderSizer) {
			copyStyles(inputStyles, placeHolderSizer);
		}
	}

	function updateInputWidth() {
		if (!mounted || !sizer || typeof sizer.scrollWidth === 'undefined') {
			return;
		}
		let newInputWidth = sizer.scrollWidth + 6;
		if (maxWidth && maxWidth < newInputWidth) {
			newInputWidth = maxWidth;
		}

		if (newInputWidth !== inputWidth) {
			inputWidth = newInputWidth;
		}
	}

	onMount(() => {
		mounted = true;
		copyInputStyles();
		updateInputWidth();
	});

	afterUpdate(() => {
		updateInputWidth();
	});

	onDestroy(() => {
		mounted = false;
	});

	$: sizerValue = [value, ''].reduce((previousValue, currentValue) => {
		if (previousValue !== null && previousValue !== undefined) {
			return previousValue;
		}
		return currentValue;
	});
</script>

<div class="my-1" style="display:inline-block">
	<input
		bind:this={input}
		class="mx-1 input text-xl sm:text-2xl py-1 px-3 sm:px-4"
		{disabled}
		{required}
		{autofocus}
		style="box-sizing:content-box"
		style:width={`${inputWidth || 2}px`}
		on:input={(event) => {
			onInput(event.target.value);
		}}
		bind:value
	/>
	<div
		bind:this={sizer}
		style="position:absolute; top:0; left:0; visibility:hidden; height:0; overflow:scroll; whiteSpace:pre"
	>
		{sizerValue}
	</div>
</div>
