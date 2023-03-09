type StringsSplitWithCloze = Array<{
	content: string;
	type: 'text' | 'cloze';
}>;

export function splitStringWithCloze(text: string): StringsSplitWithCloze {
	let startingIndex = 0;
	const result: StringsSplitWithCloze = [];

	while (startingIndex < text.length) {
		const openingIndex = text.indexOf('{{', startingIndex);
		if (openingIndex === -1) {
			break;
		}
		const closingIndex = text.indexOf('}}', openingIndex);
		if (closingIndex === -1) {
			break;
		}
		result.push({
			content: text.slice(startingIndex, openingIndex),
			type: 'text'
		});
		result.push({
			content: text.slice(openingIndex + 2, closingIndex),
			type: 'cloze'
		});
		startingIndex = closingIndex + 2;
	}

	if (startingIndex < text.length) {
		result.push({
			content: text.slice(startingIndex),
			type: 'text'
		});
	}

	return result;
}
