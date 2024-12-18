import { Form, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";

import { createAvatar } from "@dicebear/core";
import * as bigSmile from "@dicebear/big-smile";
import { ContextProps } from "~/utils/types/ContextProps.type";
import AvatarCustomization from "./AvatarCustomization";
import SpinnerSVG from "~/components/SpinnerSVG";

export default function ProfileInfo() {
    const {
        supabase,
        user,
        addNotification,
        userDisplayName,
        setUserDisplayName,
        setAvatarUri,
    } = useOutletContext<ContextProps>();

    const [enableNameEdit, setEnableNameEdit] = useState<boolean>(false);
    const [nameValue, setNameValue] = useState<string>(userDisplayName);

    // fetch display name
    useEffect(() => {
        if (!user) return;
        (async function () {
            const { data: profileData, error: profileError } = await supabase
                .from("PROFILES")
                .select("display_name")
                .eq("id", user.id);

            if (profileError) {
                console.error("Error fetching profile", profileError);
                addNotification("Error fetching profile", "FAIL");
                return;
            }

            if (profileData.length === 0) {
                addNotification("No profile found", "FAIL");
                return;
            }
            setUserDisplayName(profileData[0].display_name);
            setNameValue(profileData[0].display_name);
        })();
    }, []);

    const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
    // underscore to differentiate from the one in outlet context
    const [_avatarUri, _setAvatarUri] = useState<string>("");
    // trigger a refetch
    const [avatarUriTrigger, setAvatarUriTrigger] = useState<{}>({});

    // fetch avatar options from db
    useEffect(() => {
        (async function () {
            if (!user) return;
            _setAvatarUri("");
            const { data, error } = await supabase
                .from("AVATARS")
                .select(`*`)
                .eq("id", user.id);

            if (error) {
                console.error("Error fetching avatar");
                addNotification("Error fetching avatar", "FAIL");
                return;
            }

            if (data.length === 0) {
                addNotification("No avatar found", "FAIL");
                return;
            }

            const avt = data[0];
            const newAvatarUri = createAvatar(bigSmile, {
                accessoriesProbability: avt.accessoriesProbability!,
                backgroundColor: [avt.backgroundColor!],
                skinColor: [avt.skinColor!],
                hairColor: [avt.hairColor!],
                // expect errors of not matching types
                // @ts-expect-error
                hair: [avt.hair!],
                // @ts-expect-error
                eyes: [avt.eyes!],
                // @ts-expect-error
                mouth: [avt.mouth!],
                // @ts-expect-error
                accessories: [avt.accessories!],
            }).toDataUri();

            setAvatarUri(newAvatarUri);
            _setAvatarUri(newAvatarUri);
        })();
    }, [avatarUriTrigger]);

    const submitNameEdit: React.FormEventHandler<HTMLFormElement> =
        async function (event) {
            event.preventDefault();

            // disable edit and set new default name
            setEnableNameEdit(false);
            setUserDisplayName(nameValue);

            // send update
            const { error } = await supabase
                .from("PROFILES")
                .update({ display_name: nameValue })
                .eq("id", user!.id);

            if (error) {
                console.error("Error updating name", error);
                addNotification("Error updating name", "FAIL");
            }
            addNotification("Name updated", "SUCCESS");
        };
    const cancelNameEdit: React.DOMAttributes<HTMLButtonElement>["onClick"] =
        function (event) {
            setEnableNameEdit(false);
            setNameValue(userDisplayName);
        };
    const onChangeNameEdit: React.ChangeEventHandler<HTMLInputElement> =
        function (event) {
            setNameValue(event.currentTarget.value.trimStart());
        };

    return (
        <>
            {showAvatarModal ? (
                <AvatarCustomization
                    setShowAvatarModal={setShowAvatarModal}
                    setAvatarUriTrigger={setAvatarUriTrigger}
                />
            ) : null}
            <div className="flex flex-col items-start px-4 md:sticky md:top-0 md:pt-20">
                <h1 className="text-2xl font-medium">Profile</h1>
                {/* Avatar */}
                <button
                    className="group relative"
                    onClick={() => setShowAvatarModal(true)}
                >
                    <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-lg">
                        {_avatarUri === "" ? (
                            <div className="h-1/3 w-1/3 text-primaryColor">
                                <SpinnerSVG />
                            </div>
                        ) : (
                            <img className="h-full w-full" src={_avatarUri} />
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
                                    className="click-shrink rounded-md bg-bgColor2 px-2 py-1 hover:bg-bgColor3"
                                    type="button"
                                    onClick={cancelNameEdit}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="click-shrink ms-2 rounded-md bg-bgColor2 px-2 py-1 hover:bg-bgColor3"
                                    type="submit"
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <button
                                className="click-shrink flex items-center rounded-md bg-bgColor2 px-2 py-1 hover:bg-bgColor3"
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
                                <span className="text-md ms-1">Edit name</span>
                            </button>
                        )}
                    </div>
                </Form>
            </div>
        </>
    );
}
