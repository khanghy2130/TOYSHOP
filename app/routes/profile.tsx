import { Form, Link, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
/// import ErrorMessage from "~/components/ErrorMessage";
import { ContextProps } from "~/utils/types/ContextProps.type";

type ProfileData = {
    display_name: string;
    //// avatar, reviews, purchases
};

export default function Profile() {
    const { supabase, user } = useOutletContext<ContextProps>();

    const [enableNameEdit, setEnableNameEdit] = useState<boolean>(false);
    const [enableAvatarCustomization, setEnableAvatarCustomization] =
        useState<boolean>(false);

    const [profileData, setProfileData] = useState<ProfileData | null>(null);

    const [nameValue, setNameValue] = useState<string>("");
    const [defaultNameValue, setDefaultNameValue] = useState<string>("");

    // fetch profile data
    useEffect(() => {
        (async function () {
            if (!user) return;
            const { data, error } = await supabase
                .from("PROFILES")
                .select("display_name")
                .eq("id", user.id)
                .returns<ProfileData[]>()
                .single();
            if (error) {
                console.error("Error fetching profile", error);
                return;
            }
            ///console.log(data);
            setProfileData(data);
            setNameValue(data.display_name);
            setDefaultNameValue(data.display_name);
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
        async function (event) {
            event.preventDefault();
            setEnableNameEdit(false);
            setNameValue(defaultNameValue);
        };
    const onChangeNameEdit: React.ChangeEventHandler<HTMLInputElement> =
        async function (event) {
            setNameValue(event.currentTarget.value);
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

    // loading render
    if (profileData === null) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>My Profile</h1>
            <Form onSubmit={submitNameEdit}>
                <input
                    className="bg-black"
                    type="text"
                    onChange={onChangeNameEdit}
                    value={nameValue}
                    disabled={!enableNameEdit}
                />
                <div>
                    {enableNameEdit ? (
                        <>
                            <button type="button" onClick={cancelNameEdit}>
                                Cancel
                            </button>
                            <button type="submit">Save</button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setEnableNameEdit(true)}
                        >
                            Edit
                        </button>
                    )}
                </div>
            </Form>
        </div>
    );
}
