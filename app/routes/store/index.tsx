import { useEffect, useState } from "react";
import TagsFilter from "./TagsFilter";
import SortOptions from "./SortOptions";
import SearchBar from "./SearchBar";
import useFetchProducts from "./useFetchProducts";
import { FilterTag, SortType, FetchTriggerType } from "./Types";
import { Tables } from "database.types";
import ProductCard from "./ProductCard";

function useLocalState<T>(stateKey: string, initialValue: T) {
    return useState<T>(() => {
        if (typeof localStorage === "undefined") return initialValue;
        const localData = localStorage.getItem(stateKey);
        return localData ? JSON.parse(localData)["data"] : initialValue;
    });
}

export default function StorePage() {
    const [products, setProducts] = useState<Tables<"PRODUCTS">[]>([]);

    // set fetchTrigger to manually trigger fetching effect
    const [fetchTrigger, setFetchTrigger] = useState<FetchTriggerType>({
        fetchMode: "NEW",
    });
    const [noMoreResult, setNoMoreResult] = useState<boolean>(false);
    const [fetchIsInProgress, setFetchIsInProgress] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useLocalState<string>(
        "searchQuery",
        "",
    );
    const [showOnSalesOnly, setShowOnSalesOnly] = useLocalState<boolean>(
        "showOnSalesOnly",
        false,
    );

    const [chosenTags, setChosenTags] = useLocalState<FilterTag[]>(
        "chosenTags",
        [],
    );

    const [chosenSort, setChosenSort] = useLocalState<SortType>(
        "chosenSort",
        "TITLE",
    );
    const [sortDescending, setSortDescending] = useLocalState<boolean>(
        "sortDescending",
        true,
    );

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

            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
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
