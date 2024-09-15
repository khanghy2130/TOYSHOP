import { useEffect, useRef, useState } from "react";
import { ProductInfo } from "./Types";
import { useNavigate, useOutletContext } from "@remix-run/react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = { productInfo: ProductInfo; SUPABASE_IMAGES_PATH: string };

export default function Gallery({ productInfo, SUPABASE_IMAGES_PATH }: Props) {
    const navigate = useNavigate();
    const { wishlist, setWishlist, supabase, user, addNotification } =
        useOutletContext<ContextProps>();

    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const selectedImageRef = useRef<HTMLImageElement>(null);

    // change image animation
    useEffect(() => {
        if (!selectedImageRef.current) return;

        selectedImageRef.current.classList.remove("scale-100");
        selectedImageRef.current.classList.add("scale-95");
        const timer = setTimeout(() => {
            if (!selectedImageRef.current) return;
            selectedImageRef.current.classList.remove("scale-95");
            selectedImageRef.current.classList.add("scale-100");
        }, 100);

        return () => clearTimeout(timer);
    }, [selectedImageIndex]);

    const addToWishlist = async function () {
        if (!user) {
            return navigate("/login");
        }

        // Attempt to delete the row first and capture how many rows were deleted
        const { data: deletedRows, error: deleteError } = await supabase
            .from("WISHLIST")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productInfo.id)
            .select();

        if (deleteError) {
            console.error("Un-wishlist failed:", deleteError);
            addNotification("Un-wishlist failed", "FAIL");
            return;
        }

        // If no rows were deleted, insert a new row
        if (deletedRows.length === 0) {
            const { error: insertError } = await supabase
                .from("WISHLIST")
                .insert([{ user_id: user.id, product_id: productInfo.id }]);

            if (insertError) {
                console.error("Wishlist failed:", insertError);
                addNotification("Wishlist failed", "FAIL");
            }
            setWishlist([...wishlist, productInfo.id]);
            addNotification("Added to wishlist", "SUCCESS");
        } else {
            setWishlist(wishlist.filter((wi) => wi !== productInfo.id));
            addNotification("Removed from wishlist", "SUCCESS");
        }
    };

    const isInWishlist = wishlist.includes(productInfo.id);

    return (
        <div className="flex flex-grow flex-col duration-100 lg:sticky lg:top-0 lg:flex-row-reverse lg:items-start">
            {/* selected image */}
            <div className="flex flex-grow justify-center p-1">
                <div className="relative">
                    <img
                        ref={selectedImageRef}
                        className="w-full max-w-[420px] transition-transform lg:max-w-[600px]"
                        src={`${SUPABASE_IMAGES_PATH}/${productInfo.id}/${productInfo.imgNames[selectedImageIndex]}`}
                    />
                    <button
                        className="click-shrink absolute right-3 top-3 text-primaryColor hover:text-primaryColorMuted sm:right-5 sm:top-5"
                        onClick={addToWishlist}
                        title="Wishlist"
                    >
                        {isInWishlist ? filledHeartIcon : emptyHeartIcon}
                    </button>
                </div>
            </div>
            {/* images list */}
            <div className="flex overflow-x-auto lg:w-32 lg:flex-col">
                {productInfo.imgNames.map((imgName, i) => (
                    <button
                        key={imgName}
                        className="click-shrink p-2"
                        onClick={() => setSelectedImageIndex(i)}
                    >
                        <img
                            className={`${selectedImageIndex === i ? "" : "opacity-50"} h-auto min-w-24 lg:w-full`}
                            src={`${SUPABASE_IMAGES_PATH}/${productInfo.id}/${imgName}`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

const emptyHeartIcon = (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-10 sm:size-12"
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
            className="size-10 sm:size-12"
        >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
    </>
);
