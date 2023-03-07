<script lang="ts">
	import type { PageData } from './$types';
	import type { Session } from '@supabase/supabase-js';

	export let data: PageData;

	let { supabase, session } = data;

	$: if (data.session) {
		console.log('💡 try to load data');
		// loadData();
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
