import { useOutletContext, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import ProductItem, { WishlistProduct } from "./ProductItem";
import { loaderDataReturnType } from "..";

type Props = {
    newWishlist: loaderDataReturnType["newWishlist"] | undefined;
    orderedProducts: loaderDataReturnType["orderedProducts"] | undefined;
};

export default function MyWishlist({ newWishlist, orderedProducts }: Props) {
    const { setWishlist } = useOutletContext<ContextProps>();

    const [products, setProducts] = useState<WishlistProduct[]>(
        orderedProducts || [],
    );

    useEffect(() => {
        if (newWishlist) {
            setWishlist(newWishlist);
        }
    }, []);

    const [highlighted, setHighlighted] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const highlightedRef = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
        const highlightWishlist = searchParams.get("wishlist");
        setHighlighted(highlightWishlist === "true");

        const timeoutId = setTimeout(() => {
            if (highlightWishlist === "true") {
                highlightedRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [searchParams]);

    return (
        <div className="w-full">
            <h1 className="mb-2 text-2xl font-medium text-textColor1">
                <span
                    ref={highlightedRef}
                    className={`${highlighted ? "bg-yellow-500 bg-opacity-20" : ""}`}
                >
                    My wishlist
                </span>
            </h1>

            {products.length === 0 ? (
                <p className="w-full text-lg">Wishlist is empty.</p>
            ) : (
                <div className="flex flex-wrap">
                    {products.map((product) => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            setProducts={setProducts}
                            products={products}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
