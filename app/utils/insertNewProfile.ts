import { ContextProps } from "~/utils/types/ContextProps.type";

async function checkProfileExists(
    supabase: ContextProps["supabase"],
    userID: string,
) {
    const { count, error } = await supabase
        .from("PROFILES")
        .select("*", { count: "estimated", head: true })
        .eq("id", userID);
    if (error || count === null) {
        console.error("Error checking if profile already exists", error);
        return true; // error? default to profile does exist
    }
    return count > 0;
}

// insert new profile only if not already exist
export default async function insertNewProfile(
    supabase: ContextProps["supabase"],
    profileObj: {
        id: string;
        display_name: string;
    },
) {
    const profileExists = await checkProfileExists(supabase, profileObj.id);
    if (profileExists) return;

    const { error } = await supabase.from("PROFILES").insert(profileObj);
    if (error) {
        console.error("Error inserting new profile", error);
    }
}
