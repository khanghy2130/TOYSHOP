import { useOutletContext, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import type { Database } from "../../database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

import { ContextProps } from "~/utils/types/ContextProps.type";

export default function Admin() {
    const { supabase, user } = useOutletContext<ContextProps>();

    const [isEditor, setIsEditor] = useState<boolean>(false);

    // set isEditor
    useEffect(function () {
        (async function () {
            const { data, error } = await supabase.rpc("check_is_editor");
            setIsEditor(data ? data : false);
        })();
    }, []);

    // useEffect(function () {
    //     (async function () {
    //         const { data, error } = await supabase.from("PRODUCTS").select("*");
    //         console.log("SELECT");
    //         console.log(data);
    //         console.log(error);
    //     })();
    //     (async function () {
    //         const { data, error } = await supabase
    //             .from("PRODUCTS")
    //             .insert([
    //                 {
    //                     product_title:
    //                         "product " + Math.floor(Math.random() * 100),
    //                     product_description: "aaa",
    //                 },
    //             ])
    //             .select();

    //         console.log("INSERT");
    //         console.log(data);
    //         console.log(error);
    //     })();
    // }, []);

    if (isEditor) {
        return (
            <div>
                <h1>You are the editor!</h1>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Access denied.</h1>
            </div>
        );
    }
}
