import { useOutletContext } from "@remix-run/react";
import { Tables } from "database.types";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";
import ReviewItem from "./ReviewItem";

export type MyReview = Tables<"REVIEWS"> & {
    product: { title: string } | null;
};

export default function MyReviews() {
    const { supabase, user, addNotification } =
        useOutletContext<ContextProps>();
    const [reviews, setReviews] = useState<MyReview[]>([]);

    useEffect(() => {
        if (!user) return;
        (async function () {
            const { data: reviewsData, error } = await supabase
                .from("REVIEWS")
                .select(`*, product:PRODUCTS(title)`)
                .order("created_at", { ascending: false })
                .eq("user_id", user.id);
            if (error) {
                console.error("Error fetching reviews", error);
                addNotification("Error fetching reviews", "FAIL");
                return;
            }

            setReviews(reviewsData);
        })();
    }, []);

    return (
        <div className="mt-6 w-full">
            <h1 className="mb-2 text-2xl font-medium text-textColor1">
                My reviews
            </h1>
            <div className="flex flex-col">
                {reviews.length === 0 && (
                    <p className="w-full text-lg">No reviews found.</p>
                )}
                <div className="flex w-full flex-col">
                    {reviews.map((r) => (
                        <ReviewItem review={r} key={r.id} />
                    ))}
                </div>
            </div>
        </div>
    );
}
