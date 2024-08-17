import { Form } from "@remix-run/react";

import SpinnerSVG from "~/components/SpinnerSVG";

type Props = {
    isAtLogin: boolean;
    loginOnSubmit: React.FormEventHandler<HTMLFormElement>;
    email: string;
    setEmail: SetState<string>;
    password: string;
    setPassword: SetState<string>;
    isSubmitting: boolean;
    errorMessage: string | null;
};

export default function LoginForm({
    props: {
        isAtLogin,
        loginOnSubmit,
        email,
        setEmail,
        password,
        setPassword,
        isSubmitting,
        errorMessage,
    },
}: {
    props: Props;
}) {
    const fillDemoAcc = () => {
        setEmail("hynguyendev@gmail.com");
        setPassword("123+Ab");
    };

    return (
        <div
            className={
                "auth-form right-1/2 " +
                (isAtLogin ? "translate-x-1/2" : "-translate-x-full")
            }
        >
            <Form method="post" onSubmit={loginOnSubmit}>
                <div className="flex flex-col">
                    <h1 className="pb-4 text-center text-2xl">Login</h1>

                    <input name="form_type" type="hidden" value="LOGIN" />
                    <label htmlFor="email_input">Email</label>
                    <input
                        name="email_input"
                        id="email_input"
                        type="email"
                        autoComplete="email"
                        required
                        className="text-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password_input">Password</label>
                    <input
                        name="password_input"
                        id="password_input"
                        type="password"
                        autoComplete="current-password"
                        className="text-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

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
                            "Log in"
                        )}
                    </button>
                    <em className="text-color-4">{errorMessage}</em>
                </div>
            </Form>
            <button className="btn mt-4 text-xs" onClick={fillDemoAcc}>
                Fill demo account
            </button>
        </div>
    );
}
