import { Link, useOutletContext } from "@remix-run/react";
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
    const [isRemoving, setIsRemoving] = useState<boolean>(false);

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
                const errorMessage =
                    "Error fetching image for " + product.title;
                console.error(errorMessage, imageError);
                addNotification(errorMessage, "FAIL");
                return;
            }

            if (fetchedImageData.length > 0) {
                setImgName(fetchedImageData[0].name);
            }
        })();
    }, []);

    async function removeFromWishlist(event: MouseEvent) {
        if (!user) return;

        setIsRemoving(true);
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
        <div className={`${isRemoving ? "opacity-50" : ""} w-full lg:w-1/2`}>
            <div className="my-1 flex items-center overflow-hidden rounded-md bg-bgColor2 lg:mx-2">
                {/* Product image */}
                <div className="flex h-16 w-16">
                    <div className="flex w-full items-center justify-center">
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
                    className="text-md ms-1 cursor-pointer leading-none underline hover:text-primaryColor sm:ms-3 sm:text-xl"
                >
                    {product.title}
                </Link>

                {/* Heart button */}
                <div className="flex flex-grow justify-end px-3">
                    <button
                        className="click-shrink text-textColor1 hover:text-textColor2"
                        onClick={removeFromWishlist}
                        title="Remove"
                        disabled={isRemoving}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-6"
                        >
                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
