import { useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = {
    product: Tables<"PRODUCTS">;
};

export default function OtherProductCard({ product }: Props) {
    const { supabase, env } = useOutletContext<ContextProps>();
    const [imgName, setImgName] = useState<string | null>(null);

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

    return (
        <div>
            {imgName === null ? (
                <p>loading...</p>
            ) : (
                <img
                    className="w-80"
                    src={`${env.SUPABASE_IMAGES_PATH}/${product.id}/${imgName}`}
                />
            )}
            <p>title: {product.title}</p>
            <p>rating: {product.average_rating}</p>
        </div>
    );
}
