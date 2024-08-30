import { FormEvent, useEffect, useState } from "react";
import { ProductInfo } from "./Types";
import { Form, useOutletContext } from "@remix-run/react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = { productInfo: ProductInfo };

export default function ReviewForm({ productInfo }: Props) {
    const { supabase, user } = useOutletContext<ContextProps>();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [enableFormInput, setEnableFormInput] = useState<boolean>(true);
    const [rating, setRating] = useState<number>(0);
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

    function starClicked(selectedRating: number) {
        setRating(selectedRating);
        //// trigger stars animation
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (rating < 1 || rating > 5) {
            return console.error("Stars amount must be between 1 and 5.");
        }

        if (!user) {
            return console.error("Not logged in.");
        }

        setIsSubmitting(true);

        // check if review already exists
        const { count, error: countError } = await supabase
            .from("REVIEWS")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("product_id", productInfo.id);

        if (countError) {
            console.error("Error upserting review", countError);
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
                return console.error("Error updating review", error);
            }
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
                return console.error("Error inserting review", error);
            }
        }

        setIsSubmitting(false);
        setEnableFormInput(false);
        ///// also update in reviews list if there, this component invokes the trigger, Reviews listens to the trigger value
    }

    async function deleteReview() {
        if (!user) return;

        const { error } = await supabase
            .from("REVIEWS")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productInfo.id);

        if (error) {
            return console.error("Error deleting review", error);
        }

        setEnableFormInput(true);
        setFeedback("");
        setRating(0);
    }

    async function enableEdit() {
        setEnableFormInput(true);
    }

    return (
        <Form
            className="flex w-full max-w-3xl flex-col"
            onSubmit={handleSubmit}
        >
            {!enableFormInput ? (
                <div>
                    <button className="btn" type="button" onClick={enableEdit}>
                        Edit review
                    </button>
                    <button
                        className="btn"
                        type="button"
                        onClick={deleteReview}
                    >
                        Delete review
                    </button>
                </div>
            ) : null}

            <div>
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        className="btn"
                        disabled={!enableFormInput}
                        type="button"
                        onClick={() => starClicked(n)}
                    >
                        {n > rating ? "_" : "O"}
                    </button>
                ))}
            </div>

            <textarea
                className="bg-color-3 p-2"
                required
                placeholder="Feedback"
                name="feedback"
                disabled={!enableFormInput}
                defaultValue={feedback}
                onChange={(e) => setFeedback(e.currentTarget.value)}
            />

            {enableFormInput ? (
                <button disabled={isSubmitting} className="btn" type="submit">
                    {isSubmitting ? "Processing..." : "Submit review"}
                </button>
            ) : null}
        </Form>
    );
}
