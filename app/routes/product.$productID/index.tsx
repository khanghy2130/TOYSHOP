import { useOutletContext, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import Gallery from "./Gallery";
import { ProductInfo, ReviewsFetchTriggerType } from "./Types";
import Tags from "./Tags";
import Reviews from "./Reviews";
import ReviewForm from "./ReviewForm";
import { BuyOptions } from "./BuyOptions";

export default function ProductPage() {
    const { supabase, user, env } = useOutletContext<ContextProps>();
    const { productID } = useParams();
    const [productInfo, setProductInfo] = useState<ProductInfo>();
    const [successfulFetch, setSuccessfulFetch] = useState<boolean>(true);

    const [chosenQuantity, setChosenQuantity] = useState<number>(1);

    const [reviewsFetchTrigger, setReviewsFetchTrigger] =
        useState<ReviewsFetchTriggerType>({
            fetchMode: "NEW",
        });

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

            <Tags productInfo={productInfo} />

            <Gallery
                productInfo={productInfo}
                SUPABASE_IMAGES_PATH={env.SUPABASE_IMAGES_PATH}
            />

            <BuyOptions
                chosenQuantity={chosenQuantity}
                setChosenQuantity={setChosenQuantity}
                productInfo={productInfo}
            />

            <ReviewForm
                setReviewsFetchTrigger={setReviewsFetchTrigger}
                productInfo={productInfo}
            />

            <Reviews
                reviewsFetchTrigger={reviewsFetchTrigger}
                setReviewsFetchTrigger={setReviewsFetchTrigger}
                productInfo={productInfo}
            />
        </div>
    );
}
