import { Form, Link, useOutletContext } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";

import { createAvatar } from "@dicebear/core";
import * as bigSmile from "@dicebear/big-smile";

import { ContextProps } from "~/utils/types/ContextProps.type";
import AvatarCustomization from "./AvatarCustomization";
import SpinnerSVG from "~/components/SpinnerSVG";

export default function Profile() {
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

    /*
    const location = useLocation();
    // scroll to element
    useEffect(() => {
        if (!hasScrolled && location.hash) {
            const elementId = location.hash.replace("#", "");
            const element = document.getElementById(elementId);
            if (element) element.scrollIntoView({ behavior: "smooth" });
        }
    }, [hasScrolled, location.hash]);
    */

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

    // unauthenticated render
    if (!user) {
        return (
            <div>
                <h1>Log in to see your profile.</h1>
                <Link to="/login">
                    <button className="btn">Login</button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1>My Profile</h1>

            <div>
                <div className="flex h-40 w-40 items-center justify-center">
                    {avatarUri === "" ? (
                        <div className="h-1/3 w-1/3 text-primaryColor">
                            <SpinnerSVG />
                        </div>
                    ) : (
                        <img className="h-full w-full" src={avatarUri} />
                    )}
                </div>
                <button
                    className="btn"
                    onClick={() => setEnableAvatarCustomization(true)}
                >
                    Edit avatar
                </button>
                {enableAvatarCustomization ? (
                    <AvatarCustomization
                        setEnableAvatarCustomization={
                            setEnableAvatarCustomization
                        }
                        setAvatarUriTrigger={setAvatarUriTrigger}
                    />
                ) : null}
            </div>

            <Form onSubmit={submitNameEdit}>
                <input
                    className="bg-black"
                    type="text"
                    onChange={onChangeNameEdit}
                    value={nameValue}
                    disabled={!enableNameEdit}
                    required
                />
                <div>
                    {enableNameEdit ? (
                        <>
                            <button
                                className="btn"
                                type="button"
                                onClick={cancelNameEdit}
                            >
                                Cancel
                            </button>
                            <button className="btn" type="submit">
                                Save
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn"
                            type="button"
                            onClick={() => setEnableNameEdit(true)}
                        >
                            Edit name
                        </button>
                    )}
                </div>
            </Form>
        </div>
    );
}
