export type FilterTag = {
    id: number;
    name: string;
};

export type SortType = "TITLE" | "PRICE" | "RATING";

// must assign new object to trigger
export type FetchTriggerType = { fetchMode: "NEW" | "EXTRA" };
