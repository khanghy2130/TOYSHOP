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

    const [mode, setMode] = useState<"CREATE" | "UPDATE">("CREATE");

    function createBtnClicked() {
        // clear all product info ///
        setMode("CREATE");
    }

    function getProductBtnClicked() {
        // fetch and show product info ///
    }

    if (!isEditor) return <h1>Access denied.</h1>;

    return (
        <div>
            <div className="flex w-full flex-col items-center">
                <button
                    className="btn enabled:cursor-pointer disabled:opacity-30"
                    onClick={createBtnClicked}
                    disabled={mode === "CREATE"}
                >
                    Create new product
                </button>
                <input
                    className="my-2 p-2 text-black"
                    type="text"
                    placeholder="Product ID"
                />
                <button className="btn" onClick={getProductBtnClicked}>
                    Get existing product
                </button>
            </div>

            <div>{mode === "CREATE" ? <h1>New product</h1> : null}</div>
            <div>{mode === "UPDATE" ? <h1>Product ID: {123}</h1> : null}</div>
        </div>
    );
}
