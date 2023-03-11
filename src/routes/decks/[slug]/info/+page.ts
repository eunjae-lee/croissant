import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { slug } = params;
	const { supabase } = await parent();
	const { data } = await supabase.from('decks').select('*').eq('slug', slug);
	return { deck: (data || [])[0] };
};
