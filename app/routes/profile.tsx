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
    const [showAvatarCustomization, setShowAvatarCustomization] =
        useState<boolean>(false);

    const [profileData, setProfileData] = useState<ProfileData | null>(null);

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
        })();
    }, []);

    const onNameEditSubmit: React.FormEventHandler<HTMLFormElement> =
        async function (event) {
            event.preventDefault();
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
            <Form onSubmit={onNameEditSubmit}>
                <input
                    type="text"
                    defaultValue={profileData.display_name}
                    disabled={!enableNameEdit}
                />
                <div>
                    {enableNameEdit ? (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setEnableNameEdit(false);
                                    //// TODO: set old name
                                }}
                            >
                                Cancel
                            </button>
                            <button type="submit">Save</button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setEnableNameEdit(true);
                            }}
                        >
                            Edit
                        </button>
                    )}
                </div>
            </Form>
        </div>
    );
}

/*
export default function Profile() {
    const { supabase, user } = useOutletContext<ContextProps>();

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

    /// TEST
    // REF: https://kopi.dev/tailwind/profile-settings-using-tailwind-ui/

    let userFullName = user.user_metadata.full_name.split(" ");
    const [tempFirstName, tempLastName] = [
        userFullName[0],
        userFullName[userFullName.length - 1],
    ];

    // Set user's info.
    const [firstName, setFirstName] = useState<string>(tempFirstName);
    const [lastName, setLastName] = useState<string>(tempLastName);
    const [email, setEmail] = useState<string | undefined>(user.email);

    // Make the fields editable.
    const [disableEdit, setdisableEdit] = useState<boolean>(true);

    // Error Message.
    const [errorMessage, seterrorMessage] = useState<string | null>(null);
    const reseterrorMessage = () => {
        seterrorMessage(null);
    };

    // Hanle save and edit's onclick functionality.
    function handleEditBtnClick(): void {
        setdisableEdit(false);
    }
    async function handleSaveBtnClick(): Promise<void> {
        setdisableEdit(true);

        // Update info of authenticated user on btn click.
        const { data, error } = await supabase.auth.updateUser({
            /// TODO: remove comment for email field. Commentted out for testing as it sent confirmation emails.

            // email: email,
            data: {
                full_name: firstName + " " + lastName,
            },
        });

        if (error) {
            seterrorMessage(error.message);
        } else {
            reseterrorMessage();
        }
    }

    /// TEST

    // authenticated render
    return (
        <div className="flex w-full flex-col gap-5 bg-white px-3 text-[#161931] md:flex-row md:px-16 lg:px-28">
            <aside className="hidden py-4 md:block md:w-1/3 lg:w-1/4">
                <div className="sticky top-12 flex flex-col gap-2 border-r border-indigo-100 p-4 text-sm">
                    <h2 className="mb-4 pl-3 text-2xl font-semibold">
                        Settings
                    </h2>
                    <div className="flex items-center rounded-full border bg-white px-3 py-2.5 font-bold text-indigo-900">
                        Public Profile
                    </div>
                </div>
            </aside>
            <main className="min-h-screen w-full py-1 md:w-2/3 lg:w-3/4">
                <div className="p-2 md:p-4">
                    <div className="mt-8 w-full px-6 pb-8 sm:max-w-xl sm:rounded-lg">
                        <h2 className="pl-6 text-2xl font-bold sm:text-xl">
                            Public Profile
                        </h2>
                        <div className="mx-auto mt-8 grid max-w-2xl">
                            <div className="mt-8 items-center text-[#202142] sm:mt-14">
                                <div className="mb-2 flex w-full flex-col items-center space-x-0 space-y-2 sm:mb-6 sm:flex-row sm:space-x-4 sm:space-y-0">
                                    <div className="w-full">
                                        <label
                                            htmlFor="user_first_name"
                                            className="font-large mb-2 block font-semibold text-indigo-900"
                                        >
                                            First name
                                        </label>
                                        <input
                                            name="user_first_name"
                                            id="user_first_name"
                                            type="text"
                                            className="block w-full rounded-lg border border-indigo-300 bg-indigo-50 p-2.5 text-sm text-indigo-900 focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Your first name"
                                            value={firstName}
                                            disabled={disableEdit}
                                            onChange={(e) => {
                                                setFirstName(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label
                                            htmlFor="user_last_name"
                                            className="font-large mb-2 block font-semibold text-indigo-900"
                                        >
                                            Last name
                                        </label>
                                        <input
                                            name="user_last_name"
                                            id="user_last_name"
                                            type="text"
                                            className="block w-full rounded-lg border border-indigo-300 bg-indigo-50 p-2.5 text-sm text-indigo-900 focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Your last name"
                                            value={lastName}
                                            disabled={disableEdit}
                                            onChange={(e) => {
                                                setLastName(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="mb-2 sm:mb-6">
                                    <label
                                        htmlFor="user_email"
                                        className="font-large mb-2 block font-semibold text-indigo-900"
                                    >
                                        Email
                                    </label>
                                    <input
                                        name="user_email"
                                        id="user_email"
                                        type="email"
                                        className="block w-full rounded-lg border border-indigo-300 bg-indigo-50 p-2.5 text-sm text-indigo-900 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Your email"
                                        value={email}
                                        disabled={disableEdit}
                                        /// TODO: remove comment after testing.
                                        // onChange={(e) => {
                                        //     setEmail(e.target.value);
                                        // }}
                                    />
                                </div>
                                <ErrorMessage
                                    props={{ errorMessage }}
                                ></ErrorMessage>
                                <div className="flex justify-center gap-5">
                                    <button
                                        type="submit"
                                        onClick={handleEditBtnClick}
                                        className="w-full rounded-lg bg-indigo-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 sm:w-auto"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={handleSaveBtnClick}
                                        className="w-full rounded-lg bg-indigo-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 sm:w-auto"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
*/
