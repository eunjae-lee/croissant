import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { slug } = params;
	const { supabase } = await parent();
	const { data: decks } = await supabase.from('decks').select('*').eq('slug', slug);
	const deck = (decks || [])[0];
	if (!deck) {
		throw error(404);
	}
	const { data: cards } = await supabase
		.from('cards')
		.select('*')
		.eq('deck_id', deck.id)
		.eq('learn', true)
		.lte('box', 5)
		.lte('next_play_ts', new Date().toISOString());

	return { deck, cards: (cards || []).sort((a, b) => a.box - b.box) };
};
