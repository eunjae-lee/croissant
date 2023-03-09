<script lang="ts">
	import Confetti from 'js-confetti';
	import NavBar from '$lib/components/NavBar.svelte';
	import Play from '$lib/components/Play.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let userId = data.session!.user.id;
	let currentIndex = 0;
</script>

<NavBar deck={data.deck} />

{#if currentIndex < data.cards.length}
	<Play
		card={{ ...data.cards[currentIndex], back: 'Je suis {{avec}} elle.' }}
		onNext={() => {
			currentIndex += 1;
			if (currentIndex === data.cards.length) {
				new Confetti().addConfetti();
			}
		}}
		onSubmit={async (score) => {
			await data.supabase.from('plays').insert({
				card_id: data.cards[currentIndex].id,
				user_id: userId,
				score
			});
		}}
	/>
{/if}
