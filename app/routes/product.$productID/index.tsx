import { useOutletContext, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import Gallery from "./Gallery";
import { ProductInfo } from "./Types";
import OtherProducts from "./other_products/OtherProducts";
import ProductDetails from "./ProductDetails";
import SpinnerSVG from "~/components/SpinnerSVG";

export default function ProductPage() {
    const { supabase, env } = useOutletContext<ContextProps>();
    const { productID } = useParams();
    const [productInfo, setProductInfo] = useState<ProductInfo>();
    const [successfulFetch, setSuccessfulFetch] = useState<boolean>(true);

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

            // set page title
            document.title = productData.title;
        })();
    }, []);

    if (!successfulFetch) {
        return (
            <div>
                <h1 className="text-2xl">No product found.</h1>
            </div>
        );
    }

    if (!productInfo) {
        return (
            <div className="flex items-center">
                <div className="mt-10 h-20 w-20 text-primaryColor">
                    <SpinnerSVG />
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full max-w-[1200px] flex-col">
            <div className="relative flex flex-col lg:flex-row lg:items-start">
                <Gallery
                    productInfo={productInfo}
                    SUPABASE_IMAGES_PATH={env.SUPABASE_IMAGES_PATH}
                />

                <div className="w-full lg:w-[480px]">
                    <ProductDetails productInfo={productInfo} />
                </div>
            </div>

            <OtherProducts productInfo={productInfo} />
        </div>
    );
}
