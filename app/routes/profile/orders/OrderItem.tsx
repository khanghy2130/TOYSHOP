import { Link, useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { useEffect, useState } from "react";
import SpinnerSVG from "~/components/SpinnerSVG";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = {
    orderItem: Tables<"ORDERS_ITEMS">;
};

export default function OrderItem({ orderItem }: Props) {
    const { supabase, env } = useOutletContext<ContextProps>();
    const [imgName, setImgName] = useState<string | null>(null);
    const [imgIsLoaded, setImgIsLoaded] = useState<boolean>(false);

    // fetch first image of product
    useEffect(() => {
        (async function () {
            if (orderItem.product_id === null) {
                return;
            }

            const { data: fetchedImageData, error: imageError } =
                await supabase.storage
                    .from("product_images")
                    .list(orderItem.product_id.toLocaleString(), {
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

    return (
        <tr className="odd:bg-white odd:bg-opacity-25 dark:odd:bg-black dark:odd:bg-opacity-15">
            {/* Product image */}
            <td>
                <div className="flex h-16 w-16 items-center justify-center sm:h-32 sm:w-32">
                    {imgName === null || !imgIsLoaded ? (
                        <div className="h-1/3 w-1/3 text-primaryColor">
                            <SpinnerSVG />
                        </div>
                    ) : null}
                    {imgName !== null ? (
                        <img
                            className={`${imgIsLoaded ? "" : "hidden"} w-full`}
                            src={`${env.SUPABASE_IMAGES_PATH}/${orderItem.product_id}/${imgName}`}
                            onLoad={() => setImgIsLoaded(true)}
                        />
                    ) : null}
                </div>
            </td>

            {/* Product title */}
            <td>
                <Link
                    to={`/product/${orderItem.product_id}`}
                    target="_blank"
                    className="cursor-pointer text-lg leading-none underline hover:text-primaryColor sm:text-xl"
                >
                    {orderItem.title}
                </Link>
            </td>

            <td>{orderItem.quantity}</td>
            <td className="font-medium">${orderItem.subtotal.toFixed(2)}</td>
        </tr>
    );
}
