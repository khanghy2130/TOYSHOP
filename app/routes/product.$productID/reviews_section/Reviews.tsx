import { ContextProps } from "~/utils/types/ContextProps.type";
import { ProductInfo, Review, ReviewsFetchTriggerType } from "../Types";
import { useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";

import ReviewCard from "./ReviewCard";
import SpinnerSVG from "~/components/SpinnerSVG";

type Props = {
    productInfo: ProductInfo;
    reviewsFetchTrigger: ReviewsFetchTriggerType;
    setReviewsFetchTrigger: SetState<ReviewsFetchTriggerType>;
};

export default function Reviews({
    productInfo,
    reviewsFetchTrigger,
    setReviewsFetchTrigger,
}: Props) {
    const { supabase } = useOutletContext<ContextProps>();

    const [noMoreResult, setNoMoreResult] = useState<boolean>(false);
    const [fetchIsInProgress, setFetchIsInProgress] = useState<boolean>(false);

    let [reviews, setReviews] = useState<Review[]>([]);
    const [chosenSort, setChosenSort] = useState<"RECENT" | "RATING">("RECENT");

    useEffect(() => {
        // new fetch? clear old results
        if (reviewsFetchTrigger.fetchMode === "NEW") {
            reviews = []; // immediate update for the fetch
            setReviews([]);
            setNoMoreResult(false);
        }

        const controller = new AbortController();
        const signal = controller.signal;

        (async function () {
            const FETCH_LIMIT = 3;
            try {
                setFetchIsInProgress(true);

                // build the query
                const query = supabase
                    .from("REVIEWS")
                    .select(
                        `
                        *,
                        PROFILES (
                            *,
                            AVATARS(*)
                        )
                    `,
                    )
                    .eq("product_id", productInfo.id)
                    .range(reviews.length, reviews.length + FETCH_LIMIT - 1);

                // sort
                if (chosenSort === "RATING") {
                    query.order("rating", {
                        ascending: false,
                    });
                } else if (chosenSort === "RECENT") {
                    query.order("created_at", {
                        ascending: false,
                    });
                }

                const { data, error } = await query
                    .abortSignal(signal)
                    .returns<Review[]>();

                if (error) throw error;

                setReviews([...reviews, ...data]);

                // no more result?
                if (data.length < FETCH_LIMIT) {
                    setNoMoreResult(true);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    if (error.name === "AbortError") {
                        console.log("Fetch aborted");
                    } else {
                        console.error("Fetch error:", error);
                    }
                }
            } finally {
                setFetchIsInProgress(false);
            }
        })();

        return () => {
            controller.abort();
        };
    }, [reviewsFetchTrigger]);

    function sortOptionButton(displayText: string, type: typeof chosenSort) {
        const isSelected = chosenSort === type;
        return (
            <button
                className="flex items-center bg-bgColor2 px-3 py-1 text-textColor1 hover:bg-bgColor3 disabled:bg-primaryColor disabled:text-primaryTextColor"
                disabled={isSelected}
                onClick={() => {
                    setChosenSort(type);
                    setReviewsFetchTrigger({ fetchMode: "NEW" });
                }}
            >
                {displayText}
            </button>
        );
    }

    return (
        <div>
            <div className="mt-10 flex">
                <h1 className="flex-grow text-xl font-medium text-primaryColor">
                    Reviews
                </h1>
                <div className="sm:text-md flex flex-wrap overflow-hidden rounded-md text-sm font-medium">
                    {sortOptionButton("Recent", "RECENT")}
                    {sortOptionButton("Rating", "RATING")}
                </div>
            </div>

            <div className="flex flex-col">
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}

                {fetchIsInProgress ? (
                    <div className="my-3 h-12 w-12 self-center text-primaryColor">
                        <SpinnerSVG />
                    </div>
                ) : null}

                {noMoreResult && reviews.length === 0 ? (
                    <p>No reviews found.</p>
                ) : null}

                {!noMoreResult && !fetchIsInProgress ? (
                    <button
                        className="click-shrink my-3 self-center rounded-lg bg-bgColor2 px-8 py-2 text-xl font-medium text-textColor1 hover:bg-bgColor3"
                        onClick={() => {
                            setReviewsFetchTrigger({ fetchMode: "EXTRA" });
                        }}
                    >
                        Show more
                    </button>
                ) : null}
            </div>
        </div>
    );
}
