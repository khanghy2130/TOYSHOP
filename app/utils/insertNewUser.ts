import { createAvatar } from "@dicebear/core";
import * as bigSmile from "@dicebear/big-smile";

import { AddNotificationFunction } from "~/components/useNotification";
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
    setAvatarUri: SetState<string>,
    setUserDisplayName: SetState<string>,
    addNotification: AddNotificationFunction,
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
        setUserDisplayName(profileObj.display_name);
    }

    // AVATAR
    const avatarExists = await checkAvatarExists(supabase, profileObj.id);
    if (!avatarExists) {
        const { data, error: avatarInsertError } = await supabase
            .from("AVATARS")
            .insert({ id: profileObj.id })
            .select()
            .single();
        if (avatarInsertError) {
            console.error("Error inserting new avatar", avatarInsertError);
            return;
        }

        setAvatarUri(
            createAvatar(bigSmile, {
                accessoriesProbability: data.accessoriesProbability!,
                backgroundColor: [data.backgroundColor!],
                skinColor: [data.skinColor!],
                hairColor: [data.hairColor!],
                // expect errors of not matching types
                // @ts-expect-error
                hair: [data.hair!],
                // @ts-expect-error
                eyes: [data.eyes!],
                // @ts-expect-error
                mouth: [data.mouth!],
                // @ts-expect-error
                accessories: [data.accessories!],
            }).toDataUri(),
        );
        addNotification("Profile created", "SUCCESS");
    }
}
