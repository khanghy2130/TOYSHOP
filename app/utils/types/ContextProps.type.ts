import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "database.types";

export type RawCartItem = {
    product_id: number;
    quantity: number;
};

export type PopupNotification = {
    id: number;
    message: string;
    type: "SUCCESS" | "FAIL";
};

export type ContextProps = {
    supabase: SupabaseClient<Database>;
    user: User | undefined;
    env: { [key: string]: string };
    wishlist: number[];
    setWishlist: SetState<number[]>;
    rawCartItems: RawCartItem[];
    setRawCartItems: SetState<RawCartItem[]>;
    userDisplayName: string;
    setUserDisplayName: SetState<string>;
    addNotification: (message: string, type: PopupNotification["type"]) => void;
    setAvatarUri: SetState<string>;
};
