import { useEffect, useState } from "react";
import TagsFilter from "./TagsFilter";
import SortOptions from "./SortOptions";
import SearchBar from "./SearchBar";

// another copy in TagsFilter.tsx
type FilterTag = {
    id: number;
    name: string;
};

// another copy in SortOptions.tsx
type SortType = "TITLE" | "PRICE" | "RATING";

export default function StorePage() {
    // set fetchTrigger to manually trigger fetching effect
    const [fetchTrigger, setFetchTrigger] = useState<{}>({});
    const [noMoreResult, setNoMoreResult] = useState<boolean>(false);
    const [fetchIsInProgress, setFetchIsInProgress] = useState<boolean>(false);

    const [seachQuery, setSeachQuery] = useState<string>("");
    const [showOnSalesOnly, setShowOnSalesOnly] = useState<boolean>(false);

    const [chosenTags, setChosenTags] = useState<FilterTag[]>([]);

    const [sortDescending, setSortDescending] = useState<boolean>(true);
    const [chosenSort, setChosenSort] = useState<SortType>("TITLE");

    // fetch results
    useEffect(() => {
        (async function () {
            /////
            console.log("start fetching");
        })();
    }, [fetchTrigger, showOnSalesOnly, chosenTags, sortDescending, chosenSort]);

    return (
        <div>
            <div>++Banners slider... (on click: set filter)</div>

            <SearchBar
                setFetchTrigger={setFetchTrigger}
                seachQuery={seachQuery}
                setSeachQuery={setSeachQuery}
                showOnSalesOnly={showOnSalesOnly}
                setShowOnSalesOnly={setShowOnSalesOnly}
            />

            <TagsFilter chosenTags={chosenTags} setChosenTags={setChosenTags} />

            <SortOptions
                chosenSort={chosenSort}
                setChosenSort={setChosenSort}
                sortDescending={sortDescending}
                setSortDescending={setSortDescending}
            />
        </div>
    );
}
