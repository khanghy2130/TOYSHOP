import { useOutletContext, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import Gallery from "./Gallery";
import { ProductInfo, ReviewsFetchTriggerType } from "./Types";
import Tags from "./Tags";
import Reviews from "./Reviews";
import ReviewForm from "./ReviewForm";
import { BuyOptions } from "./BuyOptions";
import OtherProducts from "./other_products/OtherProducts";

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
        if (!productID) return;

        // fetch product info + images
        (async function () {
            const { data: productData, error } = await supabase
                .from("PRODUCTS")
                .select(
                    `
                        *,
                        tags:PRODUCTS_TAGS(tag_id(name))
                    `,
                )
                .eq("id", productID)
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

                average_rating: productData.average_rating,
                discount: productData.discount,
                price: productData.price,
                price_with_discount: productData.price_with_discount,

                // @ts-expect-error
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
        <div className="flex w-full max-w-[1200px] flex-col">
            <div className="relative flex flex-col bg-black lg:flex-row lg:items-start">
                {/* sticky container */}
                <div className="flex flex-grow flex-col lg:sticky lg:top-0 lg:flex-row-reverse lg:items-start">
                    {/* selected image */}
                    <div className="flex flex-grow justify-center bg-red-950">
                        <img
                            className="w-full max-w-[420px] lg:max-w-[600px]"
                            src={
                                "https://static.vecteezy.com/system/resources/thumbnails/027/971/388/small_2x/3d-render-round-warm-orange-fire-flame-icon-realistic-hot-sparks-light-gas-logo-design-for-emoticon-energy-power-ui-png.png"
                            }
                        />
                    </div>
                    {/* images list */}
                    <div className="flex overflow-x-auto lg:w-32 lg:flex-col">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <img
                                className="h-auto w-24 lg:w-full"
                                key={i}
                                src={
                                    "https://static.vecteezy.com/system/resources/thumbnails/027/971/388/small_2x/3d-render-round-warm-orange-fire-flame-icon-realistic-hot-sparks-light-gas-logo-design-for-emoticon-energy-power-ui-png.png"
                                }
                            />
                        ))}
                    </div>
                </div>

                <div className="h-[1200px] w-full bg-orange-900 lg:w-[480px]"></div>
            </div>

            <div className="h-[400px] w-full bg-sky-600"></div>
            {/* <Tags productInfo={productInfo} />

            <Gallery
                productInfo={productInfo}
                SUPABASE_IMAGES_PATH={env.SUPABASE_IMAGES_PATH}
            />

            <BuyOptions
                chosenQuantity={chosenQuantity}
                setChosenQuantity={setChosenQuantity}
                productInfo={productInfo}
            /> */}

            {/* 
            <ReviewForm
                setReviewsFetchTrigger={setReviewsFetchTrigger}
                productInfo={productInfo}
            />

            <Reviews
                reviewsFetchTrigger={reviewsFetchTrigger}
                setReviewsFetchTrigger={setReviewsFetchTrigger}
                productInfo={productInfo}
            />

            <OtherProducts productID={productInfo.id} /> */}
        </div>
    );
}
