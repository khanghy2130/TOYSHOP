import { useOutletContext, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type ProductInfo = {
    id: number;
    title: string;
    description: string;
    quantity: number;
    tags: string[];
    imgNames: string[];
};

export default function ProductPage() {
    const { supabase, user, env } = useOutletContext<ContextProps>();
    const { productID } = useParams();
    const [productInfo, setProductInfo] = useState<ProductInfo>();
    const [successfulFetch, setSuccessfulFetch] = useState<boolean>(true);

    const [chosenQuantity, setChosenQuantity] = useState<number>(1);

    // fetch product
    useEffect(() => {
        (async function () {
            // fetch and show product info
            const { data: productData, error } = await supabase
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
                .eq("id", productID!)
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
                setSuccessfulFetch(false);
                return;
            }

            const { data: fetchedImagesData, error: imagesError } =
                await supabase.storage
                    .from("product_images")
                    .list(productData.id.toLocaleString());

            if (imagesError) {
                console.error("Error fetching images", imagesError);
                setSuccessfulFetch(false);
                return;
            }

            setProductInfo({
                id: productData.id,
                title: productData.title,
                description: productData.description,
                quantity: productData.quantity,
                tags: productData.tags.map(({ tag_id }) => tag_id.name),
                imgNames: fetchedImagesData.map((imgData) => imgData.name),
            });
        })();
    }, []);

    async function addToCart() {
        if (!user) {
            alert("not logged in");
            return;
            ////////
        }

        // insert into CARTS table
        const { error } = await supabase.from("CARTS").insert({
            user_id: user.id,
            product_id: Number(productID),
            quantity: chosenQuantity,
        });

        if (error) {
            console.error("Error adding product to cart", error);
            return;
        }

        console.log("Added to cart");
    }

    if (!successfulFetch) {
        return <div>No product found.</div>;
    }

    if (!productInfo) {
        return <div>Loading product...</div>;
    }

    return (
        <div>
            <h1>{productInfo.title}</h1>
            <p>{productInfo.description}</p>
            {productInfo.tags.map((tag) => (
                <div className="flex" key={tag}>
                    <p className="rounded-lg border-2 border-solid border-color-2 p-1">
                        {tag}
                    </p>
                </div>
            ))}
            {productInfo.imgNames.map((imgName, i) => (
                <div className="flex" key={i}>
                    <img
                        className="w-80"
                        src={`${env.SUPABASE_IMAGES_PATH}/${productInfo.id}/${imgName}`}
                    />
                </div>
            ))}
            <select
                value={chosenQuantity}
                onChange={(e) =>
                    setChosenQuantity(Number(e.currentTarget.value))
                }
                className="text-black"
            >
                {Array.apply(null, Array(5)).map((x, i) => (
                    <option key={i + 1} value={i + 1}>
                        {i + 1}
                    </option>
                ))}
            </select>

            <button className="btn" onClick={addToCart}>
                Add to cart
            </button>
        </div>
    );
}
