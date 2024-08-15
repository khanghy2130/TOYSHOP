import { useState } from "react";

type FilterTag = {
    name: string;
    id: string;
};

type SortType = "TITLE" | "PRICE" | "RATING";

export default function StorePage() {
    const [noMoreResult, setNoMoreResult] = useState<boolean>(false);
    const [fetchIsInProgress, setFetchIsInProgress] = useState<boolean>(false);

    const [seachQuery, setSeachQuery] = useState<string>("");
    const [showOnSalesOnly, setShowOnSalesOnly] = useState<boolean>(false);

    const [allTags, setAllTags] = useState<FilterTag[]>([]);
    const [chosenTags, setChosenTags] = useState<FilterTag[]>([]);

    const [sortDescending, setSortDescending] = useState<boolean>(true);
    const [chosenSort, setChosenSort] = useState<SortType>("TITLE");

    function initiateFetching() {
        /////
        console.log("start fetching");
        console.log(seachQuery);
        console.log(showOnSalesOnly);
    }

    function sortOptionButton(displayText: string, type: SortType) {
        if (chosenSort === type) {
            // selected sort type render
            return (
                <button
                    className="btn"
                    onClick={(e) => setSortDescending(!sortDescending)}
                >
                    {displayText + (sortDescending ? "(D)" : "(A)")}
                </button>
            );
        } else {
            return (
                <button className="btn" onClick={(e) => setChosenSort(type)}>
                    {displayText}
                </button>
            );
        }
    }

    return (
        <div>
            <div>++Banners slider... (on click: set filter)</div>

            <div>
                <input
                    className="bg-color-3 p-2"
                    type="text"
                    placeholder="Search"
                    onKeyDown={(e) => {
                        // hit enter to search
                        if (e.key == "Enter") {
                            e.preventDefault();
                            initiateFetching();
                        }
                    }}
                    onChange={(e) => setSeachQuery(e.currentTarget.value)}
                />
                <button
                    className="btn"
                    type="button"
                    onClick={initiateFetching}
                >
                    Search
                </button>
            </div>

            <div>
                <label className="inline-flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        checked={showOnSalesOnly}
                        onChange={(e) => setShowOnSalesOnly(!showOnSalesOnly)}
                        className="peer sr-only"
                    />
                    <div
                        className="peer relative h-6 w-11 rounded-full bg-color-3
                        after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full 
                        after:bg-color-2 after:transition-all after:content-[''] peer-checked:bg-color-4
                        peer-checked:after:translate-x-full
                        rtl:peer-checked:after:-translate-x-full"
                    ></div>
                    <span className="ms-3 text-sm font-medium text-color-2">
                        On sale only
                    </span>
                </label>
            </div>

            <div className="flex">
                <button
                    className="btn"
                    onClick={() => {
                        ///// new modal to add actual tag
                        setChosenTags([
                            ...chosenTags,
                            {
                                id: Math.random() * 1000 + "",
                                name: Math.floor(Math.random() * 1000) + "",
                            },
                        ]); /// test
                    }}
                >
                    Add tag
                </button>
                {chosenTags.map((chosenTag) => (
                    <button
                        className="btn text-xs hover:line-through"
                        key={chosenTag.id}
                        onClick={() => {
                            // remove this tag
                            setChosenTags(
                                chosenTags.filter((ct) => ct !== chosenTag),
                            );
                        }}
                    >
                        {chosenTag.name}
                    </button>
                ))}
            </div>

            <div className="flex">
                {sortOptionButton("Title", "TITLE")}
                {sortOptionButton("Price", "PRICE")}
                {sortOptionButton("Rating", "RATING")}
            </div>
            {/* {Array.apply(null, Array(100)).map((x, i) => (
                <p key={i}>{i}</p>
            ))} */}
        </div>
    );
}
