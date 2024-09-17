import { Link, useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { useEffect, useState } from "react";
import SpinnerSVG from "~/components/SpinnerSVG";
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

    const imgSrc = `${env.SUPABASE_IMAGES_PATH}/${product.id}/${imgName}`;

    return (
        <div className="flex w-1/2 p-1 sm:p-2 md:w-1/4">
            <Link
                to={`/product/${product.id}`}
                className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-gradient-to-tl from-bgColor1 to-bgColor2 shadow-md sm:rounded-xl"
            >
                <div className="relative flex aspect-square w-full cursor-pointer items-center justify-center">
                    {imgName === null ? (
                        <div className="h-1/3 w-1/3 text-primaryColor">
                            <SpinnerSVG />
                        </div>
                    ) : (
                        <img className="w-full" src={imgSrc} />
                    )}
                </div>

                <div className="p-1 sm:p-2">
                    <h1 className="text-md leading-none sm:text-xl">
                        {product.title}
                    </h1>
                    <div className="flex items-center">
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
                        <span className="text-md ms-1 font-medium sm:text-lg">
                            {product.average_rating === 0
                                ? "-"
                                : product.average_rating.toFixed(1)}
                        </span>
                    </div>
                </div>

                <div className="flex flex-grow flex-col justify-end">
                    <div className="p-1 sm:p-2">
                        <h2 className="text-xl font-bold sm:text-2xl">
                            ${product.price_with_discount?.toFixed(2)}
                        </h2>
                        {product.discount > 0 ? (
                            <h3 className="text-md sm:text-lg">
                                <span className="text-textColor2 line-through">
                                    ${product.price.toFixed(2)}
                                </span>
                                <span className="ms-1 font-medium text-primaryColor">
                                    -{product.discount}%
                                </span>
                            </h3>
                        ) : null}
                    </div>
                </div>
            </Link>
        </div>
    );

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
