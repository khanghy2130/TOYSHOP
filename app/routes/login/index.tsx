import { useOutletContext, useNavigate } from "@remix-run/react";
import { useState } from "react";

import googleIcon from "~/assets/oauth_providers/google-icon.png";
import githubIcon from "~/assets/oauth_providers/github-icon.png";

import type { Provider } from "@supabase/supabase-js";
import { ContextProps } from "~/utils/types/ContextProps.type";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function Login() {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const resetErrorMessage = () => setErrorMessage(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // switch between login & signup
    const [isAtLogin, setIsAtLogin] = useState<boolean>(true);
    const { supabase } = useOutletContext<ContextProps>();

    const providerClicked = async (providerName: Provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: providerName,
        });
        if (error) alert("Error while logging in.");
    };

    // LOGIN
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginOnSubmit: React.FormEventHandler<HTMLFormElement> = async (
        event,
    ) => {
        event.preventDefault();
        resetErrorMessage();
        setIsSubmitting(true);

        const { error, data } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) {
            setIsSubmitting(false);
            setErrorMessage(error.message);
            return;
        }
        return navigate("/");
    };

    // SIGNUP
    const [passReqs, setPassReqs] = useState<{ [key: string]: boolean }>({
        hasSixChar: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSymbol: false,
    });

    const registerOnSubmit: React.FormEventHandler<HTMLFormElement> = async (
        event,
    ) => {
        event.preventDefault();
        resetErrorMessage();
        setIsSubmitting(true);

        const form = event.currentTarget;

        /// BUG: Need to reload the app every time user_data in option has changed ( 111-115 ).
        const formValues: { [key: string]: string } = {
            displayName: form["reg_display_name_input"].value,
            email: form["reg_email_input"].value,
            password: form["reg_password_input"].value,
            passwordConfirm: form["reg_confirm_password_input"].value,
        };

        const validations: [boolean, string][] = [
            [passReqs.hasSixChar, "Password should be at least 6 characters"],
            [
                passReqs.hasUppercase,
                "Password should contain at least 1 uppercase",
            ],
            [
                passReqs.hasLowercase,
                "Password should contain at least 1 lowercase",
            ],
            [passReqs.hasNumber, "Password should contain at least 1 number"],
            [passReqs.hasSymbol, "Password should contain at least 1 symbol"],
            [
                formValues.password === formValues.passwordConfirm,
                "Passwords don't match",
            ],
        ];

        const validationsPassed = validations.every((vali) => {
            if (!vali[0]) {
                setTimeout(() => {
                    setErrorMessage(vali[1]);
                }, 1);
                return false;
            } else return true;
        });

        if (validationsPassed) {
            const { error, data } = await supabase.auth.signUp({
                email: formValues.email,
                password: formValues.password,
                options: {
                    data: {
                        full_name: formValues.displayName,
                    },
                },
            });
            if (error) {
                setIsSubmitting(false);
                setErrorMessage(error.message);
                return;
            }
            return navigate("/");
        } else {
            setIsSubmitting(false);
            return;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center md:flex-row">
            <div className="flex flex-col items-center">
                <h1 className="mb-4 text-xl">Continue with</h1>
                <div className="flex h-20 flex-row justify-center md:h-auto md:w-20 md:flex-col">
                    <button
                        className="oauth-provider-btn"
                        onClick={() => providerClicked("google")}
                    >
                        <img className="h-full" src={googleIcon} alt="google" />
                    </button>
                    <button
                        className="oauth-provider-btn"
                        onClick={() => providerClicked("github")}
                    >
                        <img className="h-full" src={githubIcon} alt="github" />
                    </button>
                </div>
            </div>
            <div className="m-8 mx-32 my-12 text-4xl">OR</div>

            <div className="relative h-[520px] w-72 overflow-hidden border-2 border-color-2 text-center">
                {/* LOGIN/SIGNUP SWITCH */}
                <button
                    className="btn absolute right-2 top-2 z-50 min-w-32 text-xs"
                    onClick={() => {
                        setIsAtLogin(!isAtLogin);
                        resetErrorMessage();
                    }}
                >
                    {isAtLogin ? "New user?" : "Login?"}
                </button>

                <LoginForm
                    props={{
                        isAtLogin,
                        loginOnSubmit,
                        email,
                        setEmail,
                        password,
                        setPassword,
                        isSubmitting,
                        errorMessage,
                    }}
                />

                <SignupForm
                    props={{
                        isAtLogin,
                        registerOnSubmit,
                        passReqs,
                        setPassReqs,
                        isSubmitting,
                        errorMessage,
                    }}
                />
            </div>
        </div>
    );
}
