import { useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import OtherProductCard from "./OtherProductCard";
import { ProductInfo } from "../Types";

type Props = {
    productInfo: ProductInfo;
};

export default function OtherProducts({ productInfo }: Props) {
    const { supabase } = useOutletContext<ContextProps>();
    const [otherProducts, setOtherProducts] = useState<Tables<"PRODUCTS">[]>(
        [],
    );

    useEffect(() => {
        (async function () {
            const { data: products, error } = await supabase.rpc(
                "get_random_items",
                { amount: 4, exclude_id: productInfo.id },
            );

            if (error) {
                console.error("Error fetching other products", error);
                return;
            }

            setOtherProducts(products);
        })();
    }, []);

    return (
        <div className="mt-12 flex flex-col px-2 sm:px-12">
            <h1 className="text-3xl">You might like</h1>
            <div className="mt-3 flex w-full flex-wrap">
                {otherProducts.map((product) => (
                    <OtherProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
