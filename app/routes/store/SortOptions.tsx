import { FetchTriggerType, SortType } from "./Types";

type Props = {
    setFetchTrigger: SetState<FetchTriggerType>;
    chosenSort: SortType;
    setChosenSort: SetState<SortType>;
    sortDescending: boolean;
    setSortDescending: SetState<boolean>;
};

export default function SortOptions({
    setFetchTrigger,
    chosenSort,
    setChosenSort,
    sortDescending,
    setSortDescending,
}: Props) {
    function sortOptionButton(displayText: string, type: SortType) {
        if (chosenSort === type) {
            // selected sort type render
            return (
                <button
                    className="text-primaryTextColor flex items-center bg-primaryColor px-4 py-1 hover:bg-primaryColorMuted"
                    onClick={() => {
                        setSortDescending(!sortDescending);
                        setFetchTrigger({ fetchMode: "NEW" });
                    }}
                >
                    <div>{sortDescending ? downArrow : upArrow}</div>
                    <span>{displayText}</span>
                </button>
            );
        } else {
            return (
                <button
                    className="hover:bg-bgColor3 bg-bgColor2 px-4 py-1"
                    onClick={() => {
                        setChosenSort(type);
                        setFetchTrigger({ fetchMode: "NEW" });
                    }}
                >
                    {displayText}
                </button>
            );
        }
    }

    return (
        <div className="flex justify-end pt-10 lg:pt-0">
            <div className="text-md flex flex-wrap overflow-hidden rounded-md font-medium">
                {sortOptionButton("Title", "TITLE")}
                {sortOptionButton("Price", "PRICE")}
                {sortOptionButton("Rating", "RATING")}
            </div>
        </div>
    );
}

const downArrow = (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
        >
            <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
                clipRule="evenodd"
            />
        </svg>
    </>
);

const upArrow = (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
        >
            <path
                fillRule="evenodd"
                d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
                clipRule="evenodd"
            />
        </svg>
    </>
);
