import { describe, expect, it } from 'vitest';
import { compareTextLoosely } from '../card';

describe('card', () => {
	describe('compareTextLoosely', () => {
		it('compares case-insensitively', () => {
			expect(compareTextLoosely('Hello', 'hello')).toBe('equal');
		});

		it('compares regardless of accent', () => {
			expect(compareTextLoosely('Café', 'cafe')).toBe('only-different-accents');
		});
	});
});
