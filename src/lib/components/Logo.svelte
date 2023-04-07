<script lang="ts">
	export let size: 'sm' | 'lg' = 'lg';
</script>

<h1 class="unstyled font-cursive" class:text-4xl={size === 'lg'} class:text-2xl={size === 'sm'}>
	Croissant
</h1>

<style>
	h1 {
		font-weight: 400;
		color: rgb(var(--theme-font-color-base) / 1);
	}
</style>
