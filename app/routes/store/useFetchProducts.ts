import { useEffect } from "react";

type FilterTag = {
    id: number;
    name: string;
};
type SortType = "TITLE" | "PRICE" | "RATING";

type Params = {
    fetchTrigger: {};
    setFetchTrigger: SetState<{}>;
    noMoreResult: boolean;
    setNoMoreResult: SetState<boolean>;
    fetchIsInProgress: boolean;
    setFetchIsInProgress: SetState<boolean>;

    seachQuery: string;
    showOnSalesOnly: boolean;
    chosenTags: FilterTag[];
    chosenSort: SortType;
    sortDescending: boolean;

    dd: number;
    setdd: SetState<number>;
};

export default function useFetchProducts({
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
}: Params) {
    function sleep(delay: number) {
        return new Promise((resolve) => setTimeout(resolve, delay));
    }

    // fetch results
    useEffect(() => {
        // ignore?
        if (noMoreResult || fetchIsInProgress) return;
        (async function () {
            setFetchIsInProgress(true);
            console.log("start fetching more, currently have " + dd);
            await sleep(1000);
            setFetchIsInProgress(false);

            //// set noMoreResult if so

            setdd(dd + 5);
        })();
    }, [fetchTrigger, showOnSalesOnly, chosenTags, chosenSort, sortDescending]);

    // automatically fetch more after a fetch if is still at bottom of page
    useEffect(() => {
        if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 2
        ) {
            console.log("AUTO FETCH");
            setFetchTrigger({});
        }
    }, [dd]);

    // event to trigger next lazy fetch
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 2
            ) {
                setFetchTrigger({});
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
}
