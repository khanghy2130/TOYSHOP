import { useState } from "react";
import { ProductInfo, ReviewsFetchTriggerType } from "../Types";
import ReviewForm from "./ReviewForm";
import Reviews from "./Reviews";

type Props = {
    productInfo: ProductInfo;
};

export default function ReviewSection({ productInfo }: Props) {
    const [reviewsFetchTrigger, setReviewsFetchTrigger] =
        useState<ReviewsFetchTriggerType>({
            fetchMode: "NEW",
        });

    return (
        <div>
            <ReviewForm
                setReviewsFetchTrigger={setReviewsFetchTrigger}
                productInfo={productInfo}
            />

            <Reviews
                reviewsFetchTrigger={reviewsFetchTrigger}
                setReviewsFetchTrigger={setReviewsFetchTrigger}
                productInfo={productInfo}
            />
        </div>
    );
}
