import { Link, useOutletContext } from "@remix-run/react";
import { CartItemType } from "./CartItemType";
import { ContextProps } from "~/utils/types/ContextProps.type";
import { useEffect, useState, MouseEvent } from "react";
import SpinnerSVG from "~/components/SpinnerSVG";

type Props = {
    cartItem: CartItemType;
    cartItems: CartItemType[];
    setCartItems: SetState<CartItemType[]>;
};

export default function CartItem({ cartItem, cartItems, setCartItems }: Props) {
    const {
        supabase,
        env,
        user,
        addNotification,
        setRawCartItems,
        rawCartItems,
    } = useOutletContext<ContextProps>();

    const [imgName, setImgName] = useState<string | null>(null);
    const [imgIsLoaded, setImgIsLoaded] = useState<boolean>(false);
    const [isRemoving, setIsRemoving] = useState<boolean>(false);

    // fetch image
    useEffect(() => {
        (async function () {
            if (!cartItem.product) return;
            // fetch first image of product
            const { data: fetchedImageData, error: imageError } =
                await supabase.storage
                    .from("product_images")
                    .list(cartItem.product.id.toLocaleString(), {
                        limit: 1,
                        sortBy: { column: "name", order: "asc" },
                    });

            if (imageError) {
                const errorMessage =
                    "Error fetching image for " + cartItem.product.title;
                console.error(errorMessage, imageError);
                addNotification(errorMessage, "FAIL");
                return;
            }

            if (fetchedImageData.length > 0) {
                setImgName(fetchedImageData[0].name);
            }
        })();
    }, []);

    if (!cartItem.product) {
        return (
            <div className="flex h-32 w-32 items-center justify-center">
                <div className="h-1/3 w-1/3 text-primaryColor">
                    <SpinnerSVG />
                </div>
            </div>
        );
    }

    async function removeFromCart(event: MouseEvent) {
        if (!user || !cartItem.product) return;

        setIsRemoving(true);
        const { error: deleteError } = await supabase
            .from("CARTS")
            .delete()
            .eq("id", cartItem.id);

        if (deleteError) {
            console.error("Removing failed:", deleteError);
            addNotification("Failed to remove", "FAIL");
            return;
        }
        setCartItems(cartItems.filter((ci) => ci.id !== cartItem.id));
        setRawCartItems(
            rawCartItems.filter(
                (rci) => rci.product_id !== cartItem.product?.id,
            ),
        );
        addNotification("Removed from cart", "SUCCESS");
    }

    const imgSrc = `${env.SUPABASE_IMAGES_PATH}/${cartItem.product.id}/${imgName}`;
    // assert price is non null
    const subtotal =
        (cartItem.product.price_with_discount || 0) * cartItem.quantity;
    return (
        <div className={`${isRemoving ? "opacity-50" : ""} relative w-full`}>
            <div className="my-1 flex h-20 items-center overflow-hidden rounded-md bg-bgColor2 sm:h-28 lg:mx-2">
                {/* Product image */}
                <div className="flex h-20 w-20 sm:h-28 sm:w-28">
                    <div className="flex h-20 w-20 items-center justify-center sm:h-28 sm:w-28">
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

                {/* Product title & quantity */}
                <div className="flex h-full flex-col items-start overflow-auto px-2 py-2 sm:px-4">
                    <Link
                        to={`/product/${cartItem.product.id}`}
                        className="cursor-pointer text-base leading-none underline hover:text-primaryColor sm:text-xl"
                    >
                        {cartItem.product.title}
                    </Link>
                    <p className="mt-1 text-sm sm:text-lg">
                        Quantity: {cartItem.quantity}
                    </p>
                </div>

                {/* Subtotal */}
                <div className="flex h-full flex-grow items-center justify-end">
                    <p className="px-2 text-base font-medium sm:px-4 sm:text-2xl">
                        ${subtotal.toFixed(2)}
                    </p>
                </div>

                {/* Remove button */}
                <div className="absolute -right-1 top-0">
                    <button
                        className="click-shrink rounded-full bg-textColor1 text-bgColor1 hover:bg-textColor2"
                        onClick={removeFromCart}
                        title="Remove"
                        disabled={isRemoving}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-6 sm:size-8"
                        >
                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
