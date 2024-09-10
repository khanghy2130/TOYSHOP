import { useEffect, useState } from "react";
import TagsFilter from "./TagsFilter";
import SortOptions from "./SortOptions";
import SearchBar from "./SearchBar";
import useFetchProducts from "./useFetchProducts";
import { FilterTag, SortType, FetchTriggerType } from "./Types";
import { Tables } from "database.types";
import ProductCard from "./ProductCard";
import SpinnerSVG from "~/components/SpinnerSVG";

export default function StorePage() {
    const [products, setProducts] = useState<Tables<"PRODUCTS">[]>([]);

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

    const [localStatesLoaded, setLocalStatesLoaded] = useState<boolean>(false);

    // set search options from local storage + check types
    useEffect(() => {
        if (localStatesLoaded) return;

        let localData = localStorage.getItem("searchQuery");
        if (localData) {
            const parsedData = JSON.parse(localData)["data"];
            if (typeof parsedData === "string") {
                setSearchQuery(parsedData);
            }
        }

        localData = localStorage.getItem("showOnSalesOnly");
        if (localData) {
            const parsedData = JSON.parse(localData)["data"];
            if (typeof parsedData === "boolean") {
                setShowOnSalesOnly(parsedData);
            }
        }

        localData = localStorage.getItem("chosenTags");
        if (localData) {
            const parsedData = JSON.parse(localData)["data"];
            if (asserter(parsedData)) {
                setChosenTags(parsedData);
            }
            function asserter(value: unknown): value is FilterTag[] {
                return (
                    Array.isArray(value) &&
                    value.length > 0 &&
                    "id" in value[0] &&
                    "name" in value[0]
                );
            }
        }

        localData = localStorage.getItem("chosenSort");
        if (localData) {
            const parsedData = JSON.parse(localData)["data"];
            if (
                parsedData === "TITLE" ||
                parsedData === "PRICE" ||
                parsedData === "RATING"
            ) {
                setChosenSort(parsedData as SortType);
            }
        }

        localData = localStorage.getItem("sortDescending");
        if (localData) {
            const parsedData = JSON.parse(localData)["data"];
            if (typeof parsedData === "boolean") {
                setSortDescending(parsedData);
            }
        }

        setLocalStatesLoaded(true);
    }, []);

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

        localStatesLoaded,
    });

    return (
        <div className="flex w-full max-w-[1200px] flex-col">
            <div>++Banners slider... (on click: set filter)</div>

            <div className="flex flex-col lg:flex-row">
                <div className="flex flex-col px-4 lg:w-1/4">
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
                </div>

                <div className="flex flex-grow flex-col px-2 md:px-4 lg:w-3/4">
                    <SortOptions
                        setFetchTrigger={setFetchTrigger}
                        chosenSort={chosenSort}
                        setChosenSort={setChosenSort}
                        sortDescending={sortDescending}
                        setSortDescending={setSortDescending}
                    />
                    <div className="mt-5 flex flex-wrap">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {fetchIsInProgress ? (
                        <div className="my-3 h-12 w-12 self-center text-primaryColor">
                            <SpinnerSVG />
                        </div>
                    ) : null}

                    {noMoreResult && products.length === 0 ? (
                        <p>No products found.</p>
                    ) : null}

                    {!noMoreResult && !fetchIsInProgress ? (
                        <button
                            className="btn my-3 self-center px-5 py-2 text-xl"
                            onClick={() => {
                                setFetchTrigger({ fetchMode: "EXTRA" });
                            }}
                        >
                            Show more
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
