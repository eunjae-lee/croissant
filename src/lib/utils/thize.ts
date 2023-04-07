export const thize = (input: number) => {
	return input + suffix(input);
};

const suffix = (input: number) => {
	const i = Math.abs(input);
	if (Number.isNaN(i) || !Number.isInteger(i)) {
		throw new Error(`${input} is not an Integer.`);
	}

	if (teen(i % 100)) return 'th';

	switch (i % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
};

const teen = (i: number) => 10 < i && i < 20;
