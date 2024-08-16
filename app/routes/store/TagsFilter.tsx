import { useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type FilterTag = {
    id: number;
    name: string;
};

type Props = {
    chosenTags: FilterTag[];
    setChosenTags: React.Dispatch<React.SetStateAction<FilterTag[]>>;
};

export default function TagsFilter({ chosenTags, setChosenTags }: Props) {
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

            if (data) setAllTags(data);
        })();
    }, []);

    function removeTag(tag: FilterTag) {
        setChosenTags(chosenTags.filter((chosenTag) => chosenTag !== tag));
    }

    function tagClicked(tag: FilterTag, isAlreadyAdded: boolean) {
        setShowTagsModal(false);
        if (isAlreadyAdded) removeTag(tag);
        else setChosenTags([...chosenTags, tag]);
    }

    return (
        <div className="flex">
            <button
                className="btn"
                onClick={() => setShowTagsModal(!showTagsModal)}
            >
                Add tag
            </button>

            {chosenTags.map((chosenTag) => (
                <button
                    className="btn text-xs hover:line-through"
                    key={chosenTag.id}
                    onClick={() => removeTag(chosenTag)}
                >
                    {chosenTag.name}
                </button>
            ))}

            {showTagsModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="h-3/4 w-11/12 max-w-[600px] overflow-y-scroll bg-color-1">
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
                                    const isAlreadyAdded =
                                        chosenTags.includes(tag);
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
        </div>
    );
}
