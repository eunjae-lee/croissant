import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import type { Database } from '$lib/types';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	const body = await event.request.json();
	const client = createClient<Database>(PUBLIC_SUPABASE_URL, env.SUPABASE_PRIVATE_KEY);
	const { data: decks } = await client.from('decks').select('*').eq('slug', event.params.slug);
	if (!decks?.[0]) {
		throw error(404, `No deck found with the slug(${event.params.slug})`);
	}
	const deck = decks[0];
	if (event.request.headers.get('Authorization') !== `Bearer ${deck.token}`) {
		throw error(403, '`Authorization` token is missing or wrong.');
	}
	await client.from('cards').insert(
		body.cards.map((card: { front: string; back: string }) => ({
			front: card.front,
			back: card.back,
			deck_id: deck.id,
			user_id: deck.user_id
		}))
	);
	return new Response(JSON.stringify({ success: true }));
};
