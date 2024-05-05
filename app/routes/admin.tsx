import { useOutletContext, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import type { Database } from "../../database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

import { ContextProps } from "~/utils/types/ContextProps.type";

export default function Admin() {
    const { supabase, user } = useOutletContext<ContextProps>();

    if (user?.role === "supabase_admin") {
        return (
            <div>
                <h1>You are admin!</h1>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Admin only.</h1>
            </div>
        );
    }
}
