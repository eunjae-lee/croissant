import { describe, it, expect } from 'vitest';
import { splitStringWithCloze } from '../cloze';

describe('cloze', () => {
	it('returns correct result', () => {
		expect(splitStringWithCloze('hello')).toEqual([{ content: 'hello', type: 'text' }]);

		expect(splitStringWithCloze('hello {{world}}')).toEqual([
			{ content: 'hello ', type: 'text' },
			{
				content: 'world',
				type: 'cloze'
			}
		]);

		expect(splitStringWithCloze('{{hello}} world')).toEqual([
			{ content: 'hello', type: 'cloze' },
			{
				content: ' world',
				type: 'text'
			}
		]);

		expect(splitStringWithCloze('hello {{world}} hi')).toEqual([
			{ content: 'hello ', type: 'text' },
			{
				content: 'world',
				type: 'cloze'
			},
			{ content: ' hi', type: 'text' }
		]);

		expect(splitStringWithCloze('hello {{world1}} hi {{world2}}')).toEqual([
			{ content: 'hello ', type: 'text' },
			{
				content: 'world1',
				type: 'cloze'
			},
			{ content: ' hi ', type: 'text' },
			{
				content: 'world2',
				type: 'cloze'
			}
		]);

		expect(splitStringWithCloze('hello {{world}}\nhey {{there}}')).toEqual([
			{ content: 'hello ', type: 'text' },
			{
				content: 'world',
				type: 'cloze'
			},
			{ content: '\nhey ', type: 'text' },
			{
				content: 'there',
				type: 'cloze'
			}
		]);
	});
});
