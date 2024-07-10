import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";

import SpinnerSVG from "~/components/SpinnerSVG";

type Props = {
    isAtLogin: boolean;
    registerOnSubmit: React.FormEventHandler<HTMLFormElement>;
    passReqs: { [key: string]: boolean };
    setPassReqs: React.Dispatch<
        React.SetStateAction<{ [key: string]: boolean }>
    >;
    isSubmitting: boolean;
    errorMessage: string | null;
};

export default function SignupForm({
    props: {
        isAtLogin,
        registerOnSubmit,
        passReqs,
        setPassReqs,
        isSubmitting,
        errorMessage,
    },
}: {
    props: Props;
}) {
    const [regPassword, setRegPassword] = useState("");
    const [showPassReqs, setShowPassReqs] = useState(false);

    // revalidate new password
    useEffect(() => {
        setPassReqs({
            hasSixChar: regPassword.length >= 6,
            hasUppercase: /[A-Z]/.test(regPassword),
            hasLowercase: /[a-z]/.test(regPassword),
            hasNumber: /\d/.test(regPassword),
            hasSymbol: /[!@#$%^&*()_+={}\[\]:;<>,.?~\\|\-]/.test(regPassword),
        });
    }, [regPassword]);

    return (
        <div
            className={
                "auth-form left-1/2 " +
                (isAtLogin ? "translate-x-full" : "-translate-x-1/2")
            }
        >
            <Form method="post" onSubmit={registerOnSubmit}>
                <div className="flex flex-col">
                    <h1 className="pb-4 text-center text-2xl">Register</h1>

                    <input name="form_type" type="hidden" value="REGISTER" />
                    {/* <label htmlFor="reg_display_name_input">Display name</label>
                    <input
                        name="reg_display_name_input"
                        id="reg_display_name_input"
                        type="text"
                        required
                        className="text-input"
                    /> */}
                    <label htmlFor="reg_email_input">Email</label>
                    <input
                        name="reg_email_input"
                        id="reg_email_input"
                        type="email"
                        autoComplete="email"
                        required
                        className="text-input"
                    />

                    {/* Password requirements popup div */}
                    <div className="relative">
                        <div
                            hidden={!showPassReqs}
                            className="absolute bottom-0 
                w-full rounded-md border-2 border-color-2 
                bg-color-1 p-2"
                        >
                            <p
                                className={
                                    passReqs.hasSixChar ? "line-through" : ""
                                }
                            >
                                At least 6 characters
                            </p>
                            <p
                                className={
                                    passReqs.hasUppercase ? "line-through" : ""
                                }
                            >
                                At least 1 uppercase
                            </p>
                            <p
                                className={
                                    passReqs.hasLowercase ? "line-through" : ""
                                }
                            >
                                At least 1 lowercase
                            </p>
                            <p
                                className={
                                    passReqs.hasNumber ? "line-through" : ""
                                }
                            >
                                At least 1 number
                            </p>
                            <p
                                className={
                                    passReqs.hasSymbol ? "line-through" : ""
                                }
                            >
                                At least 1 symbol
                            </p>
                        </div>
                    </div>

                    <label htmlFor="reg_password_input">Password</label>
                    <input
                        name="reg_password_input"
                        id="reg_password_input"
                        type="password"
                        autoComplete="new-password"
                        className="text-input"
                        required
                        onFocus={() => setShowPassReqs(true)}
                        onBlur={() => setShowPassReqs(false)}
                        onChange={(e) => setRegPassword(e.target.value)}
                        value={regPassword}
                    />
                    <label htmlFor="reg_confirm_password_input">
                        Confirm password
                    </label>
                    <input
                        name="reg_confirm_password_input"
                        id="reg_confirm_password_input"
                        type="password"
                        autoComplete="new-password"
                        className="text-input"
                        required
                    />
                    <em className="text-color-4">{errorMessage}</em>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn mt-2 inline-flex justify-center"
                    >
                        {isSubmitting ? (
                            <div className="h-6 w-6">
                                <SpinnerSVG />
                            </div>
                        ) : (
                            "Sign up"
                        )}
                    </button>
                </div>
            </Form>
        </div>
    );
}
