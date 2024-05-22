import { useOutletContext, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { ContextProps } from "~/utils/types/ContextProps.type";
import ProductDetails from "./ProductDetails";

export default function Admin() {
    const { supabase, user } = useOutletContext<ContextProps>();

    // null is still checking
    const [isEditor, setIsEditor] = useState<boolean | "checking">("checking");

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

    if (isEditor === "checking") return <h1>Checking permission...</h1>;
    if (!isEditor) return <h1>Access denied.</h1>;

    return (
        <div className="flex flex-col items-center">
            <div className="flex w-full flex-row items-center justify-around">
                <button
                    className="btn enabled:cursor-pointer disabled:opacity-30"
                    onClick={createBtnClicked}
                    disabled={mode === "CREATE"}
                >
                    Create new product
                </button>
                <div className="flex flex-col">
                    <input
                        className="my-2 p-2 text-black"
                        type="text"
                        placeholder="Product ID"
                    />
                    <button className="btn" onClick={getProductBtnClicked}>
                        Load existing product
                    </button>
                </div>
            </div>

            <h1 className="py-10 text-center text-4xl">
                {mode === "CREATE" ? "New product" : null}
                {mode === "UPDATE" ? `Product ID: ${123}` : null}
            </h1>

            <ProductDetails mode={mode} />
        </div>
    );
}
