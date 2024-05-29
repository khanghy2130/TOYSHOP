import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "database.types";

export type ContextProps = {
    supabase: SupabaseClient<Database>;
    user: User | undefined;
    env: { [key: string]: string };
};
