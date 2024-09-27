import { Link, useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import { MyReview } from "./MyReviews";
import SpinnerSVG from "~/components/SpinnerSVG";

type Props = {
    review: MyReview;
};

export default function ReviewItem({ review }: Props) {
    const { supabase, env, addNotification } = useOutletContext<ContextProps>();

    const [imgName, setImgName] = useState<string | null>(null);
    const [imgIsLoaded, setImgIsLoaded] = useState<boolean>(false);

    // fetch image
    useEffect(() => {
        (async function () {
            // fetch first image of product
            const { data: fetchedImageData, error: imageError } =
                await supabase.storage
                    .from("product_images")
                    .list(review.product_id.toLocaleString(), {
                        limit: 1,
                        sortBy: { column: "name", order: "asc" },
                    });

            if (imageError) {
                const errorMessage =
                    "Error fetching image for " + review.product?.title;
                console.error(errorMessage, imageError);
                addNotification(errorMessage, "FAIL");
                return;
            }

            if (fetchedImageData.length > 0) {
                setImgName(fetchedImageData[0].name);
            }
        })();
    }, []);

    const imgSrc = `${env.SUPABASE_IMAGES_PATH}/${review.product_id}/${imgName}`;

    return (
        <div className="w-full lg:w-1/2">
            <div className="my-1 flex h-28 overflow-hidden rounded-md bg-bgColor2 lg:mx-2">
                {/* Product image */}
                <div className="flex max-h-28 min-h-28 min-w-28 max-w-28">
                    <div className="flex w-full items-center justify-center">
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

                <div className="flex overflow-hidden px-3 py-2">
                    <div className="flex flex-col items-start overflow-auto">
                        {/* Product title */}
                        <Link
                            to={`/product/${review.product_id}`}
                            className="cursor-pointer text-lg leading-none underline hover:text-primaryColor sm:text-xl"
                        >
                            {review.product?.title}
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center py-2">
                            {[1, 2, 3, 4, 5].map((num) => {
                                const isEmpty = num > review.rating;
                                return (
                                    <div key={num} className="">
                                        {isEmpty ? emptyStar : filledStar}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feedback */}
                        <p className="pr-2">{review.feedback}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const filledStar = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5 text-orange-500 dark:text-yellow-400"
    >
        <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
        />
    </svg>
);

const emptyStar = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 text-orange-500 dark:text-yellow-400"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
    </svg>
);
