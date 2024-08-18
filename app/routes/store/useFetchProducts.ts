import { useEffect, useState } from "react";
import { FetchTriggerType, ProductInfo } from "./Types";
import { useOutletContext } from "@remix-run/react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Params = {
    products: ProductInfo[];
    setProducts: SetState<ProductInfo[]>;

    fetchTrigger: FetchTriggerType;
    noMoreResult: boolean;
    setNoMoreResult: SetState<boolean>;
    fetchIsInProgress: boolean;
    setFetchIsInProgress: SetState<boolean>;
};

export default function useFetchProducts({
    products,
    setProducts,

    fetchTrigger,
    noMoreResult,
    setNoMoreResult,
    fetchIsInProgress,
    setFetchIsInProgress,
}: Params) {
    const { supabase } = useOutletContext<ContextProps>();

    // fetch results
    useEffect(() => {
        // new fetch? clear old results
        if (fetchTrigger.fetchMode === "NEW") {
            products = []; // immediate update for the fetch
            setProducts([]);
            setNoMoreResult(false);
        }

        const controller = new AbortController();
        const signal = controller.signal;

        (async function () {
            const FETCH_LIMIT = 6;
            try {
                setFetchIsInProgress(true);
                const { data, error } = await supabase
                    .from("PRODUCTS")
                    .select("id, title, price, discount")
                    .range(products.length, products.length + FETCH_LIMIT - 1)
                    .abortSignal(signal)
                    .returns<ProductInfo[]>();

                if (error) throw error;

                console.log(data);
                setProducts([...products, ...data]);

                // no more result?
                if (data.length < FETCH_LIMIT) {
                    setNoMoreResult(true);
                }
            } catch (error: any) {
                if (error.name === "AbortError") {
                    console.log("Fetch aborted");
                } else {
                    console.error("Fetch error:", error);
                }
            } finally {
                setFetchIsInProgress(false);
            }
        })();

        return () => {
            controller.abort();
        };
    }, [fetchTrigger]);
}
