import { useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";

import { FetchTriggerType, FilterTag } from "./Types";

type Props = {
    setFetchTrigger: SetState<FetchTriggerType>;
    chosenTags: FilterTag[];
    setChosenTags: SetState<FilterTag[]>;
};

export default function TagsFilter({
    setFetchTrigger,
    chosenTags,
    setChosenTags,
}: Props) {
    const { supabase } = useOutletContext<ContextProps>();
    const [allTags, setAllTags] = useState<FilterTag[]>([]);
    const [showTagsModal, setShowTagsModal] = useState<boolean>(false);

    useEffect(() => {
        (async function () {
            const { data, error } = await supabase.from("TAGS").select("*");

            if (error) {
                console.error("Error fetching tags", error);
                return;
            }

            setAllTags(data);
        })();
    }, []);

    function removeTag(tag: FilterTag) {
        setChosenTags(
            chosenTags.filter((chosenTag) => chosenTag.id !== tag.id),
        );
    }

    function tagClicked(tag: FilterTag, isAlreadyAdded: boolean) {
        setShowTagsModal(false);
        if (isAlreadyAdded) removeTag(tag);
        else setChosenTags([...chosenTags, tag]);
        setFetchTrigger({ fetchMode: "NEW" });
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
                <button
                    className="btn mr-2 flex flex-row px-2 py-1 text-lg"
                    onClick={() => setShowTagsModal(!showTagsModal)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-7"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 6h.008v.008H6V6Z"
                        />
                    </svg>
                    <span className="ms-1">Tag</span>
                </button>

                {chosenTags.map((chosenTag) => (
                    <button
                        className="rounded-full border-2 border-bgColor2 px-3 py-1 text-sm hover:bg-bgColor2"
                        key={chosenTag.id}
                        onClick={() => {
                            removeTag(chosenTag);
                            setFetchTrigger({ fetchMode: "NEW" });
                        }}
                    >
                        {chosenTag.name}
                    </button>
                ))}
            </div>

            {showTagsModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="h-3/4 w-11/12 max-w-[600px] overflow-y-scroll bg-bgColor1">
                        <div className="flex flex-row">
                            <h1>Tags</h1>
                            <button
                                className="btn"
                                onClick={() => setShowTagsModal(false)}
                            >
                                Close
                            </button>
                        </div>

                        {allTags.length === 0 ? (
                            <p>No tags found</p>
                        ) : (
                            <div className="flex flex-wrap">
                                {allTags.map((tag) => {
                                    const isAlreadyAdded = chosenTags.some(
                                        (ct) => ct.id === tag.id,
                                    );
                                    const conditionClass = isAlreadyAdded
                                        ? "line-through"
                                        : "";
                                    return (
                                        <button
                                            className={`btn ${conditionClass}`}
                                            key={tag.id}
                                            onClick={() =>
                                                tagClicked(tag, isAlreadyAdded)
                                            }
                                        >
                                            {tag.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </>
    );
}
