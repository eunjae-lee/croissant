export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          created_ts: string
          id: string
          token: string
          updated_ts: string | null
          user_id: string
        }
        Insert: {
          created_ts?: string
          id?: string
          token?: string
          updated_ts?: string | null
          user_id: string
        }
        Update: {
          created_ts?: string
          id?: string
          token?: string
          updated_ts?: string | null
          user_id?: string
        }
      }
      cards: {
        Row: {
          back: string
          box: number
          created_ts: string
          deck_id: string
          deleted: boolean
          front: string
          id: string
          last_played_ts: string | null
          learn: boolean
          next_play_ts: string | null
          updated_ts: string | null
          user_id: string
        }
        Insert: {
          back: string
          box?: number
          created_ts?: string
          deck_id: string
          deleted?: boolean
          front: string
          id?: string
          last_played_ts?: string | null
          learn?: boolean
          next_play_ts?: string | null
          updated_ts?: string | null
          user_id: string
        }
        Update: {
          back?: string
          box?: number
          created_ts?: string
          deck_id?: string
          deleted?: boolean
          front?: string
          id?: string
          last_played_ts?: string | null
          learn?: boolean
          next_play_ts?: string | null
          updated_ts?: string | null
          user_id?: string
        }
      }
      decks: {
        Row: {
          created_ts: string
          deleted: boolean | null
          hard_mode: boolean | null
          id: string
          name: string
          num_plays: number | null
          play_score_sum: number | null
          slug: string
          token: string
          updated_ts: string | null
          user_id: string
        }
        Insert: {
          created_ts?: string
          deleted?: boolean | null
          hard_mode?: boolean | null
          id?: string
          name: string
          num_plays?: number | null
          play_score_sum?: number | null
          slug?: string
          token?: string
          updated_ts?: string | null
          user_id: string
        }
        Update: {
          created_ts?: string
          deleted?: boolean | null
          hard_mode?: boolean | null
          id?: string
          name?: string
          num_plays?: number | null
          play_score_sum?: number | null
          slug?: string
          token?: string
          updated_ts?: string | null
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cards_to_play: {
        Args: {
          param_user_id: string
        }
        Returns: {
          r_deck_id: string
          r_when_to_play: string
          r_count: number
        }[]
      }
      delete_card: {
        Args: {
          param_card_id: string
        }
        Returns: undefined
      }
      delete_deck: {
        Args: {
          param_deck_id: string
        }
        Returns: undefined
      }
      total_cards: {
        Args: {
          param_user_id: string
        }
        Returns: {
          r_deck_id: string
          r_count: number
        }[]
      }
      update_deck_score: {
        Args: {
          deck_id: string
          score: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
