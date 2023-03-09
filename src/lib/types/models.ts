import type { Database } from './database.types';

export type Deck = Database['public']['Tables']['decks']['Row'];

export type Card = Database['public']['Tables']['cards']['Row'];

export type Play = Database['public']['Tables']['plays']['Row'];
