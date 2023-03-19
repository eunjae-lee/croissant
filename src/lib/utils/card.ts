import type { Card } from '$lib/types';

export const hasSomethingToReveal = (card: Card) => /{{.+}}/.test(card.back);
