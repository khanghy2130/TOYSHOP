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

async function checkAvatarExists(
    supabase: ContextProps["supabase"],
    userID: string,
) {
    const { count, error } = await supabase
        .from("AVATARS")
        .select("*", { count: "estimated", head: true })
        .eq("id", userID);

    if (error || count === null) {
        console.error("Error checking if avatar already exists", error);
        return true; // error? default to avatar does exist
    }
    return count > 0;
}

// insert new profile & avatar (if not already exist)
export default async function insertNewUser(
    supabase: ContextProps["supabase"],
    profileObj: {
        id: string;
        display_name: string;
    },
) {
    // PROFILE
    const profileExists = await checkProfileExists(supabase, profileObj.id);
    if (!profileExists) {
        const { error: profileInsertError } = await supabase
            .from("PROFILES")
            .insert(profileObj);
        if (profileInsertError) {
            console.error("Error inserting new profile", profileInsertError);
            return;
        }
    }

    // AVATAR
    const avatarExists = await checkAvatarExists(supabase, profileObj.id);
    if (!avatarExists) {
        const { error: avatarInsertError } = await supabase
            .from("AVATARS")
            .insert({ id: profileObj.id });
        if (avatarInsertError) {
            console.error("Error inserting new avatar", avatarInsertError);
            return;
        }
    }
}
