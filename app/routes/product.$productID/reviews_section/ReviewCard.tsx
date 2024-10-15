import { useEffect, useState } from "react";
import { createAvatar } from "@dicebear/core";
import * as bigSmile from "@dicebear/big-smile";
import { Review } from "../Types";
import SpinnerSVG from "~/components/SpinnerSVG";

type Props = {
    review: Review;
};

export default function ReviewCard({ review }: Props) {
    const [avatarUri, setAvatarUri] = useState<string>("");

    // create avatar
    useEffect(() => {
        const data = review.PROFILES.AVATARS;
        setAvatarUri(
            createAvatar(bigSmile, {
                accessoriesProbability: data.accessoriesProbability!,
                backgroundColor: [data.backgroundColor!],
                skinColor: [data.skinColor!],
                hairColor: [data.hairColor!],
                // expect errors of not matching types
                // @ts-expect-error
                hair: [data.hair!],
                // @ts-expect-error
                eyes: [data.eyes!],
                // @ts-expect-error
                mouth: [data.mouth!],
                // @ts-expect-error
                accessories: [data.accessories!],
            }).toDataUri(),
        );
    }, []);

    return (
        <div className="mt-5 overflow-hidden rounded-lg bg-bgColor2 p-3 shadow-md">
            <div className="flex">
                {/* avatar image */}
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-md">
                    {avatarUri === "" ? (
                        <div className="h-1/3 w-1/3">
                            <SpinnerSVG />
                        </div>
                    ) : (
                        <img className="h-full w-full" src={avatarUri} />
                    )}
                </div>
                <div className="flex flex-col px-2">
                    <h3 className="text-lg">{review.PROFILES.display_name}</h3>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((num) => {
                            const isEmpty = num > review.rating;
                            return (
                                <div key={num} className="">
                                    {isEmpty ? emptyStar : filledStar}
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-textColor2">
                        {new Date(review.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <p className="whitespace-pre-wrap pt-1">{review.feedback}</p>
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
