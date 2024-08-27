import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database, Tables } from "database.types";

export type ContextProps = {
    supabase: SupabaseClient<Database>;
    user: User | undefined;
    env: { [key: string]: string };
    wishlist: number[];
    setWishlist: SetState<number[]>;
    cartCount: number;
    setCartCount: SetState<number>;
};
