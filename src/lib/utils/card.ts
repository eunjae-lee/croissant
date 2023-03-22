import type { Card } from '$lib/types';

export const hasSomethingToReveal = (card: Card) => /{{.+}}/.test(card.back);

export type TextComparisonResult = 'different' | 'equal' | 'only-different-accents';

function compareStringsIgnoreAccents(text1: string, text2: string) {
	const normalizedStr1 = text1
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
	const normalizedStr2 = text2
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();

	return normalizedStr1 === normalizedStr2;
}

const cleanUpText = (text: string | undefined) => {
	return (text || '')
		.trim()
		.toLowerCase()
		.split('\n')
		.map((line) => line.trim())
		.join(' ')
		.replaceAll(/[“”]/g, `"`)
		.replaceAll(/[!?.,"`\-:;<>]/g, '')
		.replaceAll(/[‘’]/g, "'");
};

export const compareTextLoosely = (
	text1: string | undefined,
	text2: string | undefined
): TextComparisonResult => {
	const cleanedUpText1 = cleanUpText(text1);
	const cleanedUpText2 = cleanUpText(text2);

	if (cleanedUpText1 === cleanedUpText2) {
		return 'equal';
	}

	if (compareStringsIgnoreAccents(cleanedUpText1, cleanedUpText2)) {
		return 'only-different-accents';
	}

	return 'different';
};
