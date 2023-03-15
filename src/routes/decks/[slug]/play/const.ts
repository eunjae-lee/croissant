const ALPHA = 4; // hours

export const SPACE_PER_BOX = {
	1: 24 * 1 - ALPHA, // almost 1 day
	2: 24 * 2 - ALPHA, // almost 2 days
	3: 24 * 5 - ALPHA, // almost 5 days
	4: 24 * 8 - ALPHA, // almost 8 days
	5: 24 * 14 - ALPHA, // almost 14 days
	6: 0
};

export const MAX_BOX = 5;

export type BOX_NUMBER = keyof typeof SPACE_PER_BOX;
