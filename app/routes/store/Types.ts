export type FilterTag = {
    id: number;
    name: string;
};

export type SortType = "TITLE" | "PRICE" | "RATING";

export type ProductInfo = {
    id: number;
    title: string;
    price: number;
    imageURL: string;
};

// must assign new object to trigger
export type FetchTriggerType = { fetchMode: "NEW" | "EXTRA" };
