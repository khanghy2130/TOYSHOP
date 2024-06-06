export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      CARTS: {
        Row: {
          id: number
          product_id: number | null
          quantity: number | null
          user_id: string | null
        }
        Insert: {
          id?: number
          product_id?: number | null
          quantity?: number | null
          user_id?: string | null
        }
        Update: {
          id?: number
          product_id?: number | null
          quantity?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "CARTS_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "PRODUCTS"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CARTS_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "PROFILES"
            referencedColumns: ["id"]
          },
        ]
      }
      editors: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "editors_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      PRODUCTS: {
        Row: {
          average_rating: number
          description: string
          id: number
          quantity: number
          title: string
        }
        Insert: {
          average_rating?: number
          description?: string
          id?: number
          quantity?: number
          title?: string
        }
        Update: {
          average_rating?: number
          description?: string
          id?: number
          quantity?: number
          title?: string
        }
        Relationships: []
      }
      PRODUCTS_TAGS: {
        Row: {
          id: number
          product_id: number | null
          tag_id: number | null
        }
        Insert: {
          id?: number
          product_id?: number | null
          tag_id?: number | null
        }
        Update: {
          id?: number
          product_id?: number | null
          tag_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "PRODUCTTAGS_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "PRODUCTS"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PRODUCTTAGS_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "TAGS"
            referencedColumns: ["id"]
          },
        ]
      }
      PROFILES: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "PROFILES_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      REVIEWS: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          product_id: number | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          product_id?: number | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          product_id?: number | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "REVIEWS_author_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "PROFILES"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "REVIEWS_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "PRODUCTS"
            referencedColumns: ["id"]
          },
        ]
      }
      TAGS: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name?: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_is_editor: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
