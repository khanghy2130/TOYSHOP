import { FormEvent, useEffect, useState } from "react";
import { ProductInfo, ReviewsFetchTriggerType } from "../Types";
import { Form, useOutletContext } from "@remix-run/react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import SpinnerSVG from "~/components/SpinnerSVG";

type Props = {
    productInfo: ProductInfo;
    setReviewsFetchTrigger: SetState<ReviewsFetchTriggerType>;
};

export default function ReviewForm({
    productInfo,
    setReviewsFetchTrigger,
}: Props) {
    const { supabase, user, addNotification } =
        useOutletContext<ContextProps>();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [enableFormInput, setEnableFormInput] = useState<boolean>(true);

    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [mouseDownOnStar, setMouseDownOnStar] = useState<boolean>(false);

    const [feedback, setFeedback] = useState<string>("");

    // load current user review
    useEffect(() => {
        if (!user) return;
        (async function () {
            const { data, error } = await supabase
                .from("REVIEWS")
                .select("*")
                .eq("user_id", user.id)
                .eq("product_id", productInfo.id);

            if (error) {
                console.error("Error fetching current user review", error);
            }

            // review found: set values
            if (data && data.length > 0) {
                setFeedback(data[0].feedback);
                setRating(data[0].rating);
                setEnableFormInput(false);
            }
        })();
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (rating < 1 || rating > 5) {
            addNotification("Rating not set", "FAIL");
            return console.error("Stars amount must be between 1 and 5.");
        }

        if (!user) {
            return console.error("Not logged in.");
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        // check if review already exists
        const { count, error: countError } = await supabase
            .from("REVIEWS")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("product_id", productInfo.id);

        if (countError) {
            console.error("Error upserting review", countError);
            addNotification("Error upserting review", "FAIL");
            return setIsSubmitting(false);
        }

        // update review
        if (count && count > 0) {
            const { error } = await supabase
                .from("REVIEWS")
                .update({
                    rating: rating,
                    feedback: feedback,
                })
                .eq("user_id", user.id)
                .eq("product_id", productInfo.id);

            if (error) {
                console.error("Error updating review", error);
                addNotification("Error updating review", "FAIL");
                return;
            }
            addNotification("Review updated", "SUCCESS");
        }
        // insert review
        else {
            const { error } = await supabase.from("REVIEWS").insert({
                user_id: user.id,
                product_id: productInfo.id,
                rating: rating,
                feedback: feedback,
            });

            if (error) {
                console.error("Error inserting review", error);
                addNotification("Error inserting review", "FAIL");
                return;
            }
            addNotification("Review added", "SUCCESS");
        }

        setIsSubmitting(false);
        setEnableFormInput(false);
        setReviewsFetchTrigger({ fetchMode: "NEW" });
    }

    async function deleteReview() {
        if (!user) return;

        const { error } = await supabase
            .from("REVIEWS")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productInfo.id);

        if (error) {
            console.error("Error deleting review", error);
            addNotification("Error deleting review", "FAIL");
            return;
        }

        addNotification("Review removed", "SUCCESS");
        setEnableFormInput(true);
        setFeedback("");
        setRating(0);
        setReviewsFetchTrigger({ fetchMode: "NEW" });
    }

    if (!user) return null;

    return (
        <Form
            className="flex w-full max-w-3xl flex-col"
            onSubmit={handleSubmit}
        >
            <h1 className="mt-10 text-xl font-medium text-primaryColor">
                My review
            </h1>

            <div
                className="mt-1 flex"
                onMouseLeave={() => setMouseDownOnStar(false)}
            >
                {[1, 2, 3, 4, 5].map((num) => {
                    const isEmpty = num > (hoverRating || rating);
                    return (
                        <button
                            key={num}
                            className={`${mouseDownOnStar && !isEmpty ? "scale-125" : ""} pl-1 transition-transform duration-150`}
                            disabled={!enableFormInput}
                            type="button"
                            onMouseEnter={() => setHoverRating(num)}
                            onMouseLeave={() => setHoverRating(null)}
                            onMouseDown={() => setMouseDownOnStar(true)}
                            onMouseUp={() => setMouseDownOnStar(false)}
                            onClick={() => setRating(num)}
                        >
                            {isEmpty ? emptyStar : filledStar}
                        </button>
                    );
                })}
            </div>

            <textarea
                className="my-2 rounded-md bg-bgColor2 p-2 text-textColor1 disabled:text-textColor2"
                required
                placeholder="Feedback"
                name="feedback"
                disabled={!enableFormInput}
                value={feedback}
                onChange={(e) => setFeedback(e.currentTarget.value.trimStart())}
            />

            {enableFormInput ? (
                <button
                    disabled={isSubmitting}
                    className="flex h-8 items-center justify-center rounded-lg bg-primaryColor text-lg font-medium text-primaryTextColor hover:bg-primaryColorMuted"
                    type="submit"
                >
                    {isSubmitting ? (
                        <div className="flex h-8 w-8 items-center justify-center">
                            <div className="h-3/4 w-3/4">
                                <SpinnerSVG />
                            </div>
                        </div>
                    ) : (
                        <span>Submit</span>
                    )}
                </button>
            ) : null}

            {!enableFormInput ? (
                <div className="flex justify-end">
                    <button
                        className="rounded-md bg-bgColor2 px-3 py-1 text-sm font-medium text-textColor1 hover:bg-bgColor3"
                        type="button"
                        onClick={() => setEnableFormInput(true)}
                    >
                        Edit
                    </button>
                    <button
                        className="ml-2 rounded-md bg-bgColor2 px-3 py-1 text-sm font-medium text-textColor1 hover:bg-bgColor3"
                        type="button"
                        onClick={deleteReview}
                    >
                        Delete
                    </button>
                </div>
            ) : null}
        </Form>
    );
}

const filledStar = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-8 text-orange-500 dark:text-yellow-400"
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
        className="size-8 text-orange-500 dark:text-yellow-400"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
    </svg>
);
