import { useOutletContext } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { ContextProps } from "~/utils/types/ContextProps.type";
import ProductDetails from "./ProductDetails";

export type UpdateFormState = {
    productID: number;
    title: string;
    description: string;
    quantity: string | number;
    tags: string[];
    imgNames: string[];
};

export default function Admin() {
    const { supabase } = useOutletContext<ContextProps>();

    // null is still checking
    const [isEditor, setIsEditor] = useState<boolean | "checking">("checking");

    const productIDInput = useRef<HTMLInputElement>(null);

    // set isEditor
    useEffect(function () {
        (async function () {
            const { data, error } = await supabase.rpc("check_is_editor");
            setIsEditor(data ? data : false);
        })();
    }, []);

    const [mode, setMode] = useState<"CREATE" | "UPDATE">("CREATE");

    const [updateFormState, setUpdateFormState] = useState<UpdateFormState>({
        productID: 0,
        title: "",
        description: "",
        quantity: "",
        tags: [],
        imgNames: [],
    });

    function createBtnClicked() {
        window.location.reload();
    }

    async function getProductBtnClicked() {
        if (productIDInput.current === null) {
            return;
        }

        // fetch and show product info
        const { data, error } = await supabase
            .from("PRODUCTS")
            .select(
                `
                id,
                title,
                description,
                quantity,
                tags:PRODUCTS_TAGS(tag_id(name))
            `,
            )
            .eq("id", productIDInput.current.value)
            .returns<
                {
                    id: number;
                    title: string;
                    description: string;
                    quantity: number;
                    tags: { tag_id: { name: string } }[];
                }[]
            >()
            .single();

        if (error) {
            console.error("Error fetching product", error);
            return;
        }

        const { data: fetchedImagesData, error: imagesError } =
            await supabase.storage
                .from("product_images")
                .list(data.id.toLocaleString());

        if (imagesError) {
            console.error("Error fetching images", imagesError);
            return;
        }

        setMode("UPDATE");
        setUpdateFormState({
            productID: data.id,
            title: data.title,
            description: data.description,
            quantity: data.quantity,
            tags: data.tags.map(({ tag_id }) => tag_id.name),
            imgNames: fetchedImagesData.map((imgData) => imgData.name),
        });
    }

    if (isEditor === "checking") return <h1>Checking permission...</h1>;
    if (!isEditor) return <h1>Access denied.</h1>;

    return (
        <div className="flex w-full max-w-[800px] flex-col items-center">
            <div className="flex w-full flex-row items-center justify-around">
                <button
                    className="bg-primaryColor p-2 text-primaryTextColor enabled:cursor-pointer disabled:opacity-30"
                    onClick={createBtnClicked}
                    disabled={mode === "CREATE"}
                >
                    Create new product
                </button>
                <div className="flex flex-col">
                    <input
                        ref={productIDInput}
                        className="my-2 p-2 text-black"
                        type="number"
                        placeholder="Product ID"
                        onKeyDown={(e) => {
                            // hit enter to load product
                            if (e.key == "Enter") {
                                e.preventDefault();
                                getProductBtnClicked();
                            }
                        }}
                    />
                    <button
                        className="bg-primaryColor p-2 text-primaryTextColor"
                        onClick={getProductBtnClicked}
                    >
                        Load existing product
                    </button>
                </div>
            </div>

            <h1 className="py-10 text-center text-4xl">
                {mode === "CREATE" ? "New product" : null}
                {mode === "UPDATE"
                    ? `Product ID: ${updateFormState.productID}`
                    : null}
            </h1>

            <ProductDetails mode={mode} updateFormState={updateFormState} />
        </div>
    );
}
