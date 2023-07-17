<div class="header">
	<slot name="header" />
</div>

<main>
	<div class="top-gap" />
	<slot />
</main>

<div class="footer">
	<slot name="footer" />
</div>

<style>
	.header {
		@apply fixed top-0 left-0 right-0 z-10;
	}

	.footer {
		@apply fixed bottom-0 left-0 right-0 z-10;
	}

	.top-gap {
		height: 4.625rem;
	}
</style>
