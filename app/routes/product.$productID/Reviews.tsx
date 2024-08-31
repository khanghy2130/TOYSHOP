import { ContextProps } from "~/utils/types/ContextProps.type";
import { ProductInfo, Review, ReviewsFetchTriggerType } from "./Types";
import { useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";

import ReviewCard from "./ReviewCard";

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
        return (
            <button
                className="btn"
                disabled={chosenSort === type}
                onClick={() => {
                    setChosenSort(type);
                    setReviewsFetchTrigger({ fetchMode: "NEW" });
                }}
            >
                {displayText} {chosenSort === type ? "(x)" : null}
            </button>
        );
    }

    return (
        <div>
            <h1>Reviews</h1>
            <div className="flex">
                {sortOptionButton("Recent", "RECENT")}
                {sortOptionButton("Rating", "RATING")}
            </div>

            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}

            {fetchIsInProgress ? <p>Loading....</p> : null}

            {noMoreResult && reviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : null}

            {!noMoreResult && !fetchIsInProgress ? (
                <button
                    className="btn"
                    onClick={() => {
                        setReviewsFetchTrigger({ fetchMode: "EXTRA" });
                    }}
                >
                    Show more
                </button>
            ) : null}
        </div>
    );
}
