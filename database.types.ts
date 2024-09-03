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
      AVATARS: {
        Row: {
          accessories: string | null
          accessoriesProbability: number | null
          backgroundColor: string | null
          eyes: string | null
          hair: string | null
          hairColor: string | null
          id: string
          mouth: string | null
          skinColor: string | null
        }
        Insert: {
          accessories?: string | null
          accessoriesProbability?: number | null
          backgroundColor?: string | null
          eyes?: string | null
          hair?: string | null
          hairColor?: string | null
          id: string
          mouth?: string | null
          skinColor?: string | null
        }
        Update: {
          accessories?: string | null
          accessoriesProbability?: number | null
          backgroundColor?: string | null
          eyes?: string | null
          hair?: string | null
          hairColor?: string | null
          id?: string
          mouth?: string | null
          skinColor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "AVATARS_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "PROFILES"
            referencedColumns: ["id"]
          },
        ]
      }
      CARTS: {
        Row: {
          id: number
          product_id: number
          quantity: number
          user_id: string
        }
        Insert: {
          id?: number
          product_id: number
          quantity: number
          user_id?: string
        }
        Update: {
          id?: number
          product_id?: number
          quantity?: number
          user_id?: string
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
      ORDERS: {
        Row: {
          created_at: string
          id: number
          payment_id: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          payment_id?: string
          total_amount: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          payment_id?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ORDERS_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ORDERS_ITEMS: {
        Row: {
          id: number
          order_id: number | null
          product_id: number | null
          quantity: number
          subtotal: number
          title: string
        }
        Insert: {
          id?: number
          order_id?: number | null
          product_id?: number | null
          quantity?: number
          subtotal: number
          title: string
        }
        Update: {
          id?: number
          order_id?: number | null
          product_id?: number | null
          quantity?: number
          subtotal?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ORDERS_ITEMS_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "ORDERS"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ORDERS_ITEMS_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "PRODUCTS"
            referencedColumns: ["id"]
          },
        ]
      }
      PRODUCTS: {
        Row: {
          average_rating: number
          description: string
          discount: number
          id: number
          price: number
          price_with_discount: number | null
          quantity: number
          title: string
        }
        Insert: {
          average_rating?: number
          description?: string
          discount?: number
          id?: number
          price?: number
          price_with_discount?: number | null
          quantity?: number
          title?: string
        }
        Update: {
          average_rating?: number
          description?: string
          discount?: number
          id?: number
          price?: number
          price_with_discount?: number | null
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
            foreignKeyName: "PRODUCTS_TAGS_product_id_fkey"
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
          display_name: string | null
          id: string
        }
        Insert: {
          display_name?: string | null
          id?: string
        }
        Update: {
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
          feedback: string
          id: number
          product_id: number | null
          rating: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feedback?: string
          id?: number
          product_id?: number | null
          rating?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feedback?: string
          id?: number
          product_id?: number | null
          rating?: number
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
      WISHLIST: {
        Row: {
          created_at: string
          id: number
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          product_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "WISHLIST_ITEMS_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "PRODUCTS"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "WISHLIST_ITEMS_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      get_product_ids_by_tags: {
        Args: {
          tag_ids: number[]
        }
        Returns: {
          product_id: number
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
