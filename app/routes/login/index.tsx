import { useOutletContext, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

import googleIcon from "~/assets/oauth_providers/google-icon.png";
import githubIcon from "~/assets/oauth_providers/github-icon.png";

import type { Provider } from "@supabase/supabase-js";
import { ContextProps } from "~/utils/types/ContextProps.type";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [{ title: "Login" }];
};

export default function Login() {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const resetErrorMessage = () => setErrorMessage(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // switch between login & signup
    const [isAtLogin, setIsAtLogin] = useState<boolean>(true);
    const { supabase, user, addNotification } =
        useOutletContext<ContextProps>();

    const providerClicked = async (providerName: Provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: providerName,
        });
        if (error) {
            console.error("Error logging in.", error);
            addNotification("Error logging in.", "FAIL");
        }
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

        return navigate("/store");
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
        const formValues: { [key: string]: string } = {
            // displayName: form["reg_display_name_input"].value,
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
            // sign up new user
            const { error: signUpError, data: signUpData } =
                await supabase.auth.signUp({
                    email: formValues.email,
                    password: formValues.password,
                });
            if (signUpError) {
                setIsSubmitting(false);
                setErrorMessage(signUpError.message);
                return;
            }

            return navigate("/store");
        } else {
            setIsSubmitting(false);
            return;
        }
    };

    return (
        <div className="flex w-full flex-col items-center justify-center md:flex-row">
            <div className="flex flex-col items-center">
                <h1 className="mb-4 text-xl">Continue with</h1>
                <div className="flex h-20 flex-row justify-center md:h-auto md:w-20 md:flex-col">
                    <button
                        className="m-2 transition-opacity hover:opacity-70"
                        onClick={() => providerClicked("google")}
                    >
                        <img className="h-full" src={googleIcon} alt="google" />
                    </button>
                    <button
                        className="m-2 transition-opacity hover:opacity-70"
                        onClick={() => providerClicked("github")}
                    >
                        <img className="h-full" src={githubIcon} alt="github" />
                    </button>
                </div>
            </div>
            <div className="m-8 mx-32 my-12 text-4xl">OR</div>

            <div className="relative h-[520px] w-full max-w-72 overflow-hidden rounded-xl border-2 border-bgColor2 text-center">
                {/* LOGIN/SIGNUP SWITCH */}
                <button
                    className="absolute right-2 top-2 z-10 min-w-24 rounded-md bg-bgColor2 py-1 text-sm font-medium hover:bg-bgColor3"
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
