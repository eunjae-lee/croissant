<div class="header">
	<slot name="header" />
</div>

<main>
	<slot />
</main>

<style>
	.header {
		@apply fixed top-0 z-10;
	}

	main {
		@apply relative;
		top: 4.625rem;
	}
</style>
