import { useOutletContext, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

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
    const { supabase, user } = useOutletContext<ContextProps>();

    const providerClicked = async (providerName: Provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: providerName,
        });
        if (error) return console.error("Error logging in.", error);
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

            /*
            // update display_name assuming a profile is already created
            if (!signUpData.user) {
                setIsSubmitting(false);
                setErrorMessage("No user object in response.");
                return;
            }
            await supabase
                .from("PROFILES")
                .update({
                    display_name: formValues.displayName,
                })
                .eq("id", signUpData.user.id);
            */

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

            <div className="relative h-[520px] w-72 overflow-hidden border-2 border-color-2 text-center">
                {/* LOGIN/SIGNUP SWITCH */}
                <button
                    className="btn absolute right-2 top-2 z-10 min-w-32 text-xs"
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
