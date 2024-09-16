import { Review } from "../Types";

type Props = {
    review: Review;
};

export default function ReviewCard({ review }: Props) {
    return (
        <div className="border-color-2 mt-5 border-2">
            <p>date: {new Date(review.created_at).toLocaleDateString()}</p>
            <p>avatar sample: {review.PROFILES.AVATARS.hair}</p>
            <p>User name: {review.PROFILES.display_name}</p>
            <p>Rating: {review.rating}</p>
            <p>Feedback: {review.feedback}</p>
        </div>
    );
}
