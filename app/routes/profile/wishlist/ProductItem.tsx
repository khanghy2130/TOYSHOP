import { Link, useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { useEffect, useState, MouseEvent } from "react";
import SpinnerSVG from "~/components/SpinnerSVG";
import { ContextProps } from "~/utils/types/ContextProps.type";

export type WishlistProduct = {
    id: number;
    title: string;
};

type Props = {
    setProducts: SetState<WishlistProduct[]>;
    products: WishlistProduct[];
    product: WishlistProduct;
};

export default function ProductItem({ setProducts, products, product }: Props) {
    const { supabase, env, user, setWishlist, wishlist, addNotification } =
        useOutletContext<ContextProps>();

    const [imgName, setImgName] = useState<string | null>(null);
    const [imgIsLoaded, setImgIsLoaded] = useState<boolean>(false);

    // fetch image
    useEffect(() => {
        (async function () {
            // fetch first image of product
            const { data: fetchedImageData, error: imageError } =
                await supabase.storage
                    .from("product_images")
                    .list(product.id.toLocaleString(), {
                        limit: 1,
                        sortBy: { column: "name", order: "asc" },
                    });

            if (imageError) {
                console.error("Error fetching image", imageError);
                return;
            }

            if (fetchedImageData.length > 0) {
                setImgName(fetchedImageData[0].name);
            }
        })();
    }, []);

    async function removeFromWishlist(event: MouseEvent) {
        event.stopPropagation();
        if (!user) return;

        const { error: deleteError } = await supabase
            .from("WISHLIST")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", product.id);

        if (deleteError) {
            console.error("Un-wishlist failed:", deleteError);
            addNotification("Un-wishlist failed:", "FAIL");
            return;
        }

        setWishlist(wishlist.filter((wi) => wi !== product.id));
        setProducts(products.filter((p) => p.id !== product.id));
        addNotification("Removed from wishlist", "SUCCESS");
    }

    const imgSrc = `${env.SUPABASE_IMAGES_PATH}/${product.id}/${imgName}`;
    return (
        <div className="my-1 flex w-full items-center overflow-hidden rounded-md bg-gradient-to-tl from-bgColor1 to-bgColor2 sm:rounded-xl">
            {/* Product image */}
            <div className="flex w-16">
                <div className="flex w-full justify-center">
                    {imgName === null || !imgIsLoaded ? (
                        <div className="h-1/3 w-1/3 text-primaryColor">
                            <SpinnerSVG />
                        </div>
                    ) : null}
                    {imgName !== null ? (
                        <img
                            className={`${imgIsLoaded ? "" : "hidden"} w-full`}
                            src={imgSrc}
                            onLoad={() => setImgIsLoaded(true)}
                        />
                    ) : null}
                </div>
            </div>

            {/* Product title */}
            <Link
                to={`/product/${product.id}`}
                className="text-md ms-1 cursor-pointer leading-none hover:text-primaryColor sm:ms-3 sm:text-xl"
            >
                {product.title}
            </Link>

            {/* Heart button */}
            <div className="flex flex-grow justify-end px-3">
                <button
                    className="click-shrink text-primaryColor hover:text-primaryColorMuted"
                    onClick={removeFromWishlist}
                    title="Remove"
                >
                    {filledHeartIcon}
                </button>
            </div>
        </div>
    );
}

const filledHeartIcon = (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-8"
        >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
    </>
);
