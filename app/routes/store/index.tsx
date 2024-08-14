import { useState } from "react";

type FilterTag = {
    name: string;
    id: string;
};

export default function StorePage() {
    const [noMoreResult, setNoMoreResult] = useState<boolean>(false);
    const [fetchIsInProgress, setFetchIsInProgress] = useState<boolean>(false);

    const [seachQuery, setSeachQuery] = useState<string>("");
    const [showOnSalesOnly, setShowOnSalesOnly] = useState<boolean>(false);

    const [allTags, setAllTags] = useState<FilterTag[]>([]);
    const [chosenTags, setChosenTags] = useState<FilterTag[]>([]);

    return (
        <div>
            <div>++Banners slider... (on click: set filter)</div>
            <div>++Search bar...</div>
            <div>++On sale only toggle...</div>
            <div>++Filter tags list...</div>
            <div>++name | price | rating... (up/down on selected)</div>
            {/* {Array.apply(null, Array(100)).map((x, i) => (
                <p key={i}>{i}</p>
            ))} */}
        </div>
    );
}
