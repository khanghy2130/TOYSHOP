import { useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import OtherProductCard from "./OtherProductCard";

type Props = {
    productID: number;
};

export default function OtherProducts({ productID }: Props) {
    const { supabase } = useOutletContext<ContextProps>();
    const [otherProducts, setOtherProducts] = useState<Tables<"PRODUCTS">[]>(
        [],
    );

    useEffect(() => {
        if (!productID) return;
        (async function () {
            const { data: products, error } = await supabase.rpc(
                "get_random_items",
                { amount: 4, exclude_id: productID },
            );

            if (error) {
                console.error("Error fetching other products", error);
                return;
            }

            setOtherProducts(products);
        })();
    }, []);

    return (
        <div>
            {otherProducts.map((product) => (
                <OtherProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
