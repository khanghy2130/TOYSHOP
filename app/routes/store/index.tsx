import { useEffect, useState } from "react";
import TagsFilter from "./TagsFilter";
import SortOptions from "./SortOptions";
import SearchBar from "./SearchBar";
import useFetchProducts from "./useFetchProducts";
import { FilterTag, SortType, FetchTriggerType, ProductInfo } from "./Types";

export default function StorePage() {
    const [products, setProducts] = useState<ProductInfo[]>([]);

    // set fetchTrigger to manually trigger fetching effect
    const [fetchTrigger, setFetchTrigger] = useState<FetchTriggerType>({
        fetchMode: "NEW",
    });
    const [noMoreResult, setNoMoreResult] = useState<boolean>(false);
    const [fetchIsInProgress, setFetchIsInProgress] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showOnSalesOnly, setShowOnSalesOnly] = useState<boolean>(false);

    const [chosenTags, setChosenTags] = useState<FilterTag[]>([]);

    const [chosenSort, setChosenSort] = useState<SortType>("TITLE");
    const [sortDescending, setSortDescending] = useState<boolean>(true);

    useFetchProducts({
        products,
        setProducts,

        fetchTrigger,
        noMoreResult,
        setNoMoreResult,
        fetchIsInProgress,
        setFetchIsInProgress,

        searchQuery,
        showOnSalesOnly,
        chosenTags,
        chosenSort,
        sortDescending,
    });

    return (
        <div>
            <div>++Banners slider... (on click: set filter)</div>

            <SearchBar
                setFetchTrigger={setFetchTrigger}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showOnSalesOnly={showOnSalesOnly}
                setShowOnSalesOnly={setShowOnSalesOnly}
            />

            <TagsFilter
                setFetchTrigger={setFetchTrigger}
                chosenTags={chosenTags}
                setChosenTags={setChosenTags}
            />

            <SortOptions
                setFetchTrigger={setFetchTrigger}
                chosenSort={chosenSort}
                setChosenSort={setChosenSort}
                sortDescending={sortDescending}
                setSortDescending={setSortDescending}
            />

            {products.map((product, i) => (
                <p key={i}>{product.title}</p>
            ))}

            {fetchIsInProgress ? <p>Loading....</p> : null}

            {noMoreResult && products.length === 0 ? (
                <p>No products found.</p>
            ) : null}

            {!noMoreResult && !fetchIsInProgress ? (
                <button
                    className="btn"
                    onClick={() => {
                        setFetchTrigger({ fetchMode: "EXTRA" });
                    }}
                >
                    Show more
                </button>
            ) : null}
        </div>
    );
}
