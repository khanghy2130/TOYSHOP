import { useEffect, useState } from "react";
import TagsFilter from "./TagsFilter";
import SortOptions from "./SortOptions";
import SearchBar from "./SearchBar";
import useFetchProducts from "./useFetchProducts";

// another copy in TagsFilter.tsx & useFetchProducts.ts
type FilterTag = {
    id: number;
    name: string;
};

// another copy in SortOptions.tsx & useFetchProducts.ts
type SortType = "TITLE" | "PRICE" | "RATING";

export default function StorePage() {
    // set fetchTrigger to manually trigger fetching effect
    const [fetchTrigger, setFetchTrigger] = useState<{}>({});
    const [noMoreResult, setNoMoreResult] = useState<boolean>(false);
    const [fetchIsInProgress, setFetchIsInProgress] = useState<boolean>(false);

    const [seachQuery, setSeachQuery] = useState<string>("");
    const [showOnSalesOnly, setShowOnSalesOnly] = useState<boolean>(false);

    const [chosenTags, setChosenTags] = useState<FilterTag[]>([]);

    const [chosenSort, setChosenSort] = useState<SortType>("TITLE");
    const [sortDescending, setSortDescending] = useState<boolean>(true);

    const [dd, setdd] = useState<number>(0);

    useFetchProducts({
        fetchTrigger,
        setFetchTrigger,
        noMoreResult,
        setNoMoreResult,
        fetchIsInProgress,
        setFetchIsInProgress,

        seachQuery,
        showOnSalesOnly,
        chosenTags,
        chosenSort,
        sortDescending,

        dd,
        setdd,
    });

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
            {Array.apply(null, Array(dd)).map((x, i) => (
                <p key={i}>{i}</p>
            ))}
        </div>
    );
}
