import { Tables } from "database.types";

export type ProductInfo = Tables<"PRODUCTS"> & {
    tags: string[];
    imgNames: string[];
};

// must assign new object to trigger
export type ReviewsFetchTriggerType = { fetchMode: "NEW" | "EXTRA" };

export type Review = Tables<"REVIEWS"> & {
    PROFILES: Tables<"PROFILES"> & { AVATARS: Tables<"AVATARS"> };
};
