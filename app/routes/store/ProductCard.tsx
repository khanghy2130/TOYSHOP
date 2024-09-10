import { useNavigate, useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { MouseEvent, useEffect, useState } from "react";
import SpinnerSVG from "~/components/SpinnerSVG";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = {
    product: Tables<"PRODUCTS">;
};

export default function ProductCard({ product }: Props) {
    const {
        user,
        supabase,
        env,
        setRawCartItems,
        rawCartItems,
        wishlist,
        setWishlist,
        addNotification,
    } = useOutletContext<ContextProps>();

    const navigate = useNavigate();
    const [imgName, setImgName] = useState<string | null>(null);
    const [imgIsLoaded, setImgIsLoaded] = useState<boolean>(false);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

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

    async function addToCart() {
        if (!user) {
            return navigate("/login");
        }

        if (isAddingToCart) return;
        setIsAddingToCart(true);

        // insert into CARTS table
        const { error } = await supabase.from("CARTS").insert({
            user_id: user.id,
            product_id: Number(product.id),
            quantity: 1,
        });

        if (error) {
            console.error("Error adding product to cart", error);
            return;
        }

        const { data, error: selectError } = await supabase
            .from("CARTS")
            .select("product_id, quantity");

        if (selectError) {
            console.error("Error fetching cart items", selectError);
            return;
        }

        setRawCartItems(data);
        addNotification("Added to cart", "SUCCESS");
        setIsAddingToCart(false);
    }

    async function addToWishlist(e: MouseEvent) {
        e.stopPropagation();

        if (!user) {
            return navigate("/login");
        }

        // Attempt to delete the row first and capture how many rows were deleted
        const { data: deletedRows, error: deleteError } = await supabase
            .from("WISHLIST")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", product.id)
            .select();

        if (deleteError) {
            console.error("Un-wishlist failed:", deleteError);
            return;
        }

        // If no rows were deleted, insert a new row
        if (deletedRows.length === 0) {
            const { error: insertError } = await supabase
                .from("WISHLIST")
                .insert([{ user_id: user.id, product_id: product.id }]);

            if (insertError) {
                console.error("Wishlist failed:", insertError);
            }
            setWishlist([...wishlist, product.id]);
            addNotification("Added to wishlist", "SUCCESS");
        } else {
            setWishlist(wishlist.filter((wi) => wi !== product.id));
            addNotification("Removed from wishlist", "SUCCESS");
        }
    }

    const goToProductPage = () => navigate(`/product/${product.id}`);

    const isInCart = rawCartItems.some((rci) => rci.product_id === product.id);
    const isInWishlist = wishlist.includes(product.id);
    const outOfStock = product.quantity <= 0;
    const imgSrc = `${env.SUPABASE_IMAGES_PATH}/${product.id}/${imgName}`;

    return (
        <div className="flex w-1/2 p-1 sm:p-2 md:w-1/3">
            <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-gradient-to-br from-bgColor1 to-bgColor2 shadow-md dark:bg-gradient-to-tl sm:rounded-xl">
                <div
                    className="relative flex aspect-square w-full cursor-pointer items-center justify-center"
                    onClick={goToProductPage}
                >
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
                    <button
                        className="click-shrink absolute right-2 top-2 text-primaryColor hover:text-primaryColorMuted"
                        onClick={addToWishlist}
                    >
                        {isInWishlist ? filledHeartIcon : emptyHeartIcon}
                    </button>
                </div>

                <div className="p-1 sm:p-2">
                    <h1
                        className="cursor-pointer text-sm leading-none hover:text-primaryColor sm:text-lg"
                        onClick={goToProductPage}
                    >
                        {product.title} afadf dsfss sg gssg gfg s gsgdg
                    </h1>
                    <div className="flex items-center pt-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-5 text-yellow-400 sm:size-7"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-md ms-1 font-medium sm:text-lg">
                            {product.average_rating === 0
                                ? "-"
                                : product.average_rating.toFixed(1)}
                        </span>
                    </div>

                    <h2 className="pt-6 text-xl font-bold sm:text-2xl">
                        ${product.price_with_discount?.toFixed(2)}
                    </h2>
                    {product.discount > 0 ? (
                        <h3 className="text-md sm:text-lg">
                            <span className="text-textColor2 line-through">
                                ${product.price}
                            </span>
                            <span className="ms-1 font-medium text-primaryColor">
                                -{product.discount}%
                            </span>
                        </h3>
                    ) : null}
                </div>

                <div className="flex flex-grow items-end">
                    <button
                        className="h-10 w-full enabled:bg-primaryColor enabled:font-medium enabled:text-primaryTextColor enabled:hover:bg-primaryColorMuted disabled:text-textColor2"
                        disabled={isInCart || outOfStock}
                        onClick={addToCart}
                    >
                        <span className="flex justify-center text-sm sm:text-xl">
                            {isInCart
                                ? "In cart"
                                : outOfStock
                                  ? "Out of stock"
                                  : renderAddToCartText(isAddingToCart)}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

const renderAddToCartText = function (isAddingToCart: boolean) {
    if (isAddingToCart) {
        return (
            <div className="h-6 w-6">
                <SpinnerSVG />
            </div>
        );
    }
    return (
        <div className="flex flex-row px-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
            </svg>
            <span className="ms-1">Add</span>
        </div>
    );
};

const emptyHeartIcon = (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-7 sm:size-10"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
        </svg>
    </>
);

const filledHeartIcon = (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-7 sm:size-10"
        >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
    </>
);
