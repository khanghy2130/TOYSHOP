import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database, Tables } from "database.types";

export type RawCartItem = {
    product_id: number;
    quantity: number;
};

export type PopupNotification = {
    id: number;
    message: string;
    type: "NEUTRAL" | "SUCCESS" | "FAIL";
};

export type ContextProps = {
    supabase: SupabaseClient<Database>;
    user: User | undefined;
    env: { [key: string]: string };
    wishlist: number[];
    setWishlist: SetState<number[]>;
    rawCartItems: RawCartItem[];
    setRawCartItems: SetState<RawCartItem[]>;
    addNotification: (message: string, type: PopupNotification["type"]) => void;
};
