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
        //setShowTagsModal(false);
        if (isAlreadyAdded) removeTag(tag);
        else setChosenTags([...chosenTags, tag]);
        setFetchTrigger({ fetchMode: "NEW" });
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
                <button
                    className="text-md mr-2 flex flex-row rounded-md bg-primaryColor px-2 py-2 font-medium text-primaryTextColor hover:bg-primaryColorMuted"
                    onClick={() => setShowTagsModal(!showTagsModal)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
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
                    <span className="ms-1">Tags</span>
                </button>

                {chosenTags.map((chosenTag) => (
                    <button
                        className="click-shrink flex items-center overflow-hidden rounded-full bg-bgColor2 text-sm hover:bg-bgColor3"
                        key={chosenTag.id}
                        onClick={() => {
                            removeTag(chosenTag);
                            setFetchTrigger({ fetchMode: "NEW" });
                        }}
                    >
                        <span className="h-full bg-bgColor2 py-[0.2rem] pl-3 pr-1 font-medium transition-none">
                            {chosenTag.name}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="ml-[0.1rem] mr-[0.2rem] size-4"
                        >
                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                        </svg>
                    </button>
                ))}
            </div>

            {showTagsModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="z-50 mx-4 flex h-80 w-full max-w-[600px] flex-col rounded-lg border-2 border-textColor2 bg-bgColor1">
                        <div className="flex w-full flex-row border-b-2 border-textColor2">
                            <h1 className="px-4 py-2 text-2xl">Tags</h1>
                            <button
                                className="ml-auto mr-4 text-textColor1 hover:text-primaryColor"
                                onClick={() => setShowTagsModal(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {allTags.length === 0 ? (
                            <p>No tags found</p>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2 overflow-y-auto p-5">
                                {allTags.map((tag) => {
                                    const isAlreadyAdded = chosenTags.some(
                                        (ct) => ct.id === tag.id,
                                    );
                                    const conditionClass = isAlreadyAdded
                                        ? "bg-primaryColor hover:bg-primaryColorMuted text-primaryTextColor"
                                        : "bg-bgColor2 hover:bg-bgColor3";
                                    return (
                                        <button
                                            className={`${conditionClass} click-shrink text-md rounded-full px-4 py-[0.2rem] font-medium`}
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
