import { error } from '@sveltejs/kit';
import { MAX_BOX } from './const';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent, locals: { supabase } }) => {
	const { slug } = params;
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
		.lte('box', MAX_BOX)
		.lte('next_play_ts', new Date().toISOString());

	return { deck, cards: (cards || []).sort((a, b) => a.box - b.box) };
};
