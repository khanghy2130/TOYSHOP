import { useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = {
    orderItem: Tables<"ORDERS_ITEMS">;
};

export default function OrderItem({ orderItem }: Props) {
    const { supabase, env } = useOutletContext<ContextProps>();
    const [imgName, setImgName] = useState<string>("");

    useEffect(() => {
        (async function () {
            if (orderItem.product_id === null) return;

            // fetch first image of product
            const { data: fetchedImageData, error: imageError } =
                await supabase.storage
                    .from("product_images")
                    .list(orderItem.product_id!.toLocaleString(), {
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
        <div>
            <img
                className="w-80"
                src={`${env.SUPABASE_IMAGES_PATH}/${orderItem.product_id}/${imgName}`}
            />
            <p>title: {orderItem.title}</p>
            <p>subtoal: {orderItem.subtotal}</p>
            <p>quantity: {orderItem.quantity}</p>
        </div>
    );
}
