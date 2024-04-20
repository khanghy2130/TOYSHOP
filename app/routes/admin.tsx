import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useOutletContext, useLoaderData } from "@remix-run/react";

import { createServerClient, parse, serialize } from "@supabase/ssr";

import type { Database } from "../../database.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader: LoaderFunction = async ({
    request,
}: LoaderFunctionArgs) => {
    const cookies = parse(request.headers.get("Cookie") ?? "");
    const headers = new Headers();

    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(key) {
                    return cookies[key];
                },
                set(key, value, options) {
                    headers.append(
                        "Set-Cookie",
                        serialize(key, value, options),
                    );
                },
                remove(key, options) {
                    headers.append("Set-Cookie", serialize(key, "", options));
                },
            },
        },
    );

    // get current user
    const supabaseUser = await supabase.auth.getUser();
    console.log(supabaseUser);

    /*
    const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", "/////a")
        .eq("role", "admin")
        .single();

    if (error) {
        console.error("Error checking admin status:", error.message);
        return json({ isAdmin: false });
    }
		*/

    return json({ isAdmin: false });
};

export default function Admin() {
    const { supabase } = useOutletContext<{
        supabase: SupabaseClient<Database>;
    }>();

    const loaderData = useLoaderData();
    console.log(loaderData); // { isAdmin: false }

    return (
        <div>
            <h1>Admin route</h1>
        </div>
    );
}
