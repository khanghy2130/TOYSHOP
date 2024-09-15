import { useNavigate, useOutletContext } from "@remix-run/react";
import { ProductInfo } from "./Types";
import { ContextProps } from "~/utils/types/ContextProps.type";
import SpinnerSVG from "~/components/SpinnerSVG";
import { useState } from "react";

type Props = {
    productInfo: ProductInfo;
};

export default function ProductDetails({ productInfo }: Props) {
    const navigate = useNavigate();
    const { rawCartItems, setRawCartItems, addNotification, user, supabase } =
        useOutletContext<ContextProps>();
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const [chosenQuantity, setChosenQuantity] = useState<number>(1);

    async function addToCart() {
        if (!user) {
            return navigate("/login");
        }

        if (productInfo.quantity < chosenQuantity) {
            addNotification("Not enough in stock", "FAIL");
            return;
        }

        if (isAddingToCart) return;
        setIsAddingToCart(true);

        // insert into CARTS table
        const { error: insertError } = await supabase.from("CARTS").insert({
            user_id: user.id,
            product_id: Number(productInfo.id),
            quantity: chosenQuantity,
        });

        if (insertError) {
            console.error("Error adding product to cart", insertError);
            addNotification("Error adding product to cart", "FAIL");
            setIsAddingToCart(false);
            return;
        }

        // refetch all cart items
        const { data, error: selectError } = await supabase
            .from("CARTS")
            .select("product_id, quantity");

        if (selectError) {
            console.error("Error fetching cart items", selectError);
            addNotification("Error fetching cart items", "FAIL");
            setIsAddingToCart(false);
            return;
        }

        setRawCartItems(data);
        addNotification("Added to cart", "SUCCESS");
        setIsAddingToCart(false);
    }

    const isInCart = rawCartItems.some(
        (rci) => rci.product_id === productInfo.id,
    );
    const outOfStock = productInfo.quantity <= 0;

    return (
        <div className="mt-4 p-3 sm:mt-0 sm:p-5">
            <h1 className="text-2xl leading-none sm:text-3xl">
                {productInfo.title}
            </h1>
            <div className="mt-1 flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 text-orange-500 dark:text-yellow-400 sm:size-6"
                >
                    <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className="ms-1 text-lg font-medium sm:text-xl">
                    {productInfo.average_rating === 0
                        ? "-"
                        : productInfo.average_rating.toFixed(1)}
                </span>
            </div>

            <h2 className="mt-10 text-2xl font-bold sm:text-4xl">
                ${productInfo.price_with_discount?.toFixed(2)}
            </h2>
            {productInfo.discount > 0 ? (
                <h3 className="text-lg sm:text-xl">
                    <span className="text-textColor2 line-through">
                        ${productInfo.price.toFixed(2)}
                    </span>
                    <span className="ms-1 font-medium text-primaryColor">
                        -{productInfo.discount}%
                    </span>
                </h3>
            ) : null}

            {StockCounter(productInfo.quantity)}
            <select
                value={chosenQuantity}
                onChange={(e) =>
                    setChosenQuantity(Number(e.currentTarget.value))
                }
                className="text-md mt-2 w-full rounded-md bg-bgColor2 px-3 py-2 text-textColor1 disabled:text-textColor2 sm:text-lg"
                disabled={isInCart || outOfStock}
            >
                {Array.from({
                    length: Math.min(
                        productInfo.quantity <= 0 ? 1 : productInfo.quantity,
                        5,
                    ),
                }).map((x, i) => (
                    <option key={i + 1} value={i + 1}>
                        Quantity: {i + 1}
                    </option>
                ))}
            </select>

            <button
                className="mt-3 w-full rounded-lg enabled:bg-primaryColor enabled:font-medium enabled:text-primaryTextColor enabled:hover:bg-primaryColorMuted disabled:bg-bgColor2 disabled:text-textColor2"
                disabled={isInCart || outOfStock}
                onClick={addToCart}
            >
                <span className="flex justify-center py-3 text-lg sm:text-2xl">
                    {isInCart
                        ? "In cart"
                        : outOfStock
                          ? "Out of stock"
                          : renderAddToCartText(isAddingToCart)}
                </span>
            </button>

            <p>description & tags</p>
            <p>Reviews + form in 1 component. includes fetchTrigger</p>
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
        <div className="flex flex-row items-center px-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 sm:size-8"
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

const StockCounter = (quantity: number) => (
    <p className="text-md mt-4 w-full text-right text-textColor2 sm:text-lg">
        {quantity <= 0
            ? "Out of stock"
            : quantity > 10
              ? "In stock"
              : `Only ${quantity} left`}
    </p>
);
