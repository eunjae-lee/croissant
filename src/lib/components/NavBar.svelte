<script lang="ts">
	import { page } from '$app/stores';

	const MENU_ITEMS = [
		{
			href: '/subjects',
			title: 'Subjects'
		}
		// {
		// 	href: '/subjects',
		// 	title: 'Play Quiz'
		// }
	];

	$: menuItems = MENU_ITEMS.map((item) => ({
		...item,
		active: $page.url.pathname === item.href
	}));
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">🥐</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			{#each menuItems as item}
				<li>
					<a
						href={item.href}
						class="decoration-wavy decoration-2 underline-offset-4 decoration-accent"
						class:underline={item.active}>{item.title}</a
					>
				</li>
			{/each}
		</ul>
	</div>
</div>
