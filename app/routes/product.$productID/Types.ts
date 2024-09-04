import { Tables } from "database.types";

export type ProductInfo = {
    id: number;
    title: string;
    description: string;
    quantity: number;
    tags: string[];
    imgNames: string[];
};

// must assign new object to trigger
export type ReviewsFetchTriggerType = { fetchMode: "NEW" | "EXTRA" };

export type Review = Tables<"REVIEWS"> & {
    PROFILES: Tables<"PROFILES"> & { AVATARS: Tables<"AVATARS"> };
};
