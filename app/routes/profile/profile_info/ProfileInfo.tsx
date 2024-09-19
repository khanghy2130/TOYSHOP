import { Form, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";

import { createAvatar } from "@dicebear/core";
import * as bigSmile from "@dicebear/big-smile";
import { ContextProps } from "~/utils/types/ContextProps.type";
import AvatarCustomization from "./AvatarCustomization";
import SpinnerSVG from "~/components/SpinnerSVG";

export default function ProfileInfo() {
    const { supabase, user, addNotification } =
        useOutletContext<ContextProps>();

    const [enableNameEdit, setEnableNameEdit] = useState<boolean>(false);
    const [enableAvatarCustomization, setEnableAvatarCustomization] =
        useState<boolean>(false);

    const [nameValue, setNameValue] = useState<string>("");
    const [defaultNameValue, setDefaultNameValue] = useState<string>("");

    const [avatarUri, setAvatarUri] = useState<string>("");
    // trigger a refetch
    const [avatarUriTrigger, setAvatarUriTrigger] = useState<{}>({});

    // fetch avatar options from db
    useEffect(() => {
        (async function () {
            if (!user) return;
            const { data, error } = await supabase
                .from("AVATARS")
                .select(`*`)
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching avatar");
                addNotification("Error fetching avatar", "FAIL");
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
        })();
    }, [avatarUriTrigger]);

    // fetch display_name
    useEffect(() => {
        (async function () {
            if (!user) return;
            const { data: profileData, error: profileError } = await supabase
                .from("PROFILES")
                .select("display_name")
                .eq("id", user.id)
                .single();
            if (profileError) {
                console.error("Error fetching profile", profileError);
                addNotification("Error fetching profile", "FAIL");
                return;
            }
            setNameValue(profileData.display_name);
            setDefaultNameValue(profileData.display_name);
        })();
    }, []);

    const submitNameEdit: React.FormEventHandler<HTMLFormElement> =
        async function (event) {
            event.preventDefault();

            // disable edit and set new default name
            setEnableNameEdit(false);
            setDefaultNameValue(nameValue);

            // send update
            const { error } = await supabase
                .from("PROFILES")
                .update({ display_name: nameValue })
                .eq("id", user!.id);

            if (error) {
                console.error("Error updating name", error);
            }
        };
    const cancelNameEdit: React.DOMAttributes<HTMLButtonElement>["onClick"] =
        function (event) {
            setEnableNameEdit(false);
            setNameValue(defaultNameValue);
        };
    const onChangeNameEdit: React.ChangeEventHandler<HTMLInputElement> =
        function (event) {
            setNameValue(event.currentTarget.value.trimStart());
        };

    return (
        <div className="flex flex-col items-start px-4 md:sticky md:top-0 md:pt-20">
            <h1 className="text-2xl font-medium">Profile</h1>
            {/* Avatar */}
            <button
                className="group relative"
                onClick={() => setEnableAvatarCustomization(true)}
            >
                <div className="h-36 w-36 overflow-hidden rounded-lg">
                    {avatarUri === "" ? (
                        <div className="h-1/3 w-1/3 text-primaryColor">
                            <SpinnerSVG />
                        </div>
                    ) : (
                        <img className="h-full w-full" src={avatarUri} />
                    )}
                </div>
                <div className="absolute -right-3 -top-3 flex rounded-full bg-bgColor2 p-2 group-hover:bg-bgColor3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5"
                    >
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                    </svg>
                </div>
            </button>
            {enableAvatarCustomization ? (
                <AvatarCustomization
                    setEnableAvatarCustomization={setEnableAvatarCustomization}
                    setAvatarUriTrigger={setAvatarUriTrigger}
                />
            ) : null}

            {/* User name */}
            <Form onSubmit={submitNameEdit} className="mt-6">
                <input
                    className="w-full max-w-52 rounded-md bg-bgColor2 px-2 py-1 text-xl text-textColor1 disabled:cursor-not-allowed disabled:text-textColor2"
                    type="text"
                    onChange={onChangeNameEdit}
                    value={nameValue}
                    disabled={!enableNameEdit}
                    required
                />
                <div className="mt-2 flex">
                    {enableNameEdit ? (
                        <>
                            <button
                                className="rounded-md bg-bgColor2 px-2 py-1 hover:bg-bgColor3"
                                type="button"
                                onClick={cancelNameEdit}
                            >
                                Cancel
                            </button>
                            <button
                                className="ms-2 rounded-md bg-bgColor2 px-2 py-1 hover:bg-bgColor3"
                                type="submit"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <button
                            className="flex items-center rounded-md bg-bgColor2 px-2 py-1 hover:bg-bgColor3"
                            type="button"
                            onClick={() => setEnableNameEdit(true)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-4"
                            >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                            </svg>
                            <span className="text-md ms-1">Edit</span>
                        </button>
                    )}
                </div>
            </Form>
        </div>
    );
}
