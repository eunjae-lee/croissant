<script lang="ts">
	export let size: 'sm' | 'lg' = 'lg';
</script>

<h1 class="unstyled" class:text-4xl={size === 'lg'} class:text-2xl={size === 'sm'}>Croissant</h1>

<style>
	h1 {
		font-family: 'Reenie Beanie', cursive;
		font-weight: 400;
		color: rgb(var(--color-primary-500) / 1);
	}
</style>
