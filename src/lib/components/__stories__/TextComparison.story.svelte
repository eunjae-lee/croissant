<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';

	import TextComparison from '../TextComparison.svelte';
	export let Hst: Hst;
</script>

<Hst.Story title="TextComparison">
	<Hst.Variant title="default">
		<TextComparison
			correctAnswer="One difference is that interfaces create a new name that is used everywhere. Type aliases don’t create a new name — for instance, error messages won’t use the alias name. In the code below, hovering over interfaced in an editor will show that it returns an Interface, but will show that aliased returns object literal type.Wish you happy"
			yourAnswer="One diffenec is that interfaces create a new name that is used everywhere. Type aliases don’t create a new name — for instance, error messages won’t use the alias name. In the code below, hovering over interfaced in an editor will show that it returns an Interface, but will show that aliased returns object literal type.Hope you will be happy every day"
		/>
	</Hst.Variant>
</Hst.Story>
