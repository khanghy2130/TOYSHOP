import { Form, useOutletContext, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { createServerClient, parse, serialize } from '@supabase/ssr';

import SpinnerSVG from "~/components/SpinnerSVG"
import googleIcon from "~/assets/oauth_providers/google-icon.png";
import githubIcon from "~/assets/oauth_providers/github-icon.png";

import type { Provider } from '@supabase/supabase-js'
import { ContextProps } from "~/utils/types/ContextProps.type";


export default function Login(){
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const resetErrorMessage = () => setErrorMessage(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // switch between login & signup
    const [isAtLogin, setIsAtLogin] = useState<boolean>(true);
    const { supabase } = useOutletContext<ContextProps>()

    const providerClicked = async (providerName: Provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: providerName
        });
        if (error) alert("Error while logging in.")
    };

    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [regPassword, setRegPassword] = useState("");
    
    const [showPassReqs, setShowPassReqs] = useState(false);
    const [passReqs, setPassReqs] = useState({
        hasSixChar: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSymbol: false
    });

    // revalidate new password
    useEffect(()=>{
        setPassReqs({
            hasSixChar: regPassword.length >= 6,
            hasUppercase: /[A-Z]/.test(regPassword),
            hasLowercase: /[a-z]/.test(regPassword),
            hasNumber: /\d/.test(regPassword),
            hasSymbol: /[!@#$%^&*()_+={}\[\]:;<>,.?~\\|\-]/.test(regPassword)
        });
    }, [regPassword]);

    
    const fillDemoAcc = ()=>{
        setEmail("hynguyendev@gmail.com");
        setPassword("123+Ab");
    };

    const loginOnSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        resetErrorMessage();
        setIsSubmitting(true);

        const {error, data} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) {
            setIsSubmitting(false);
            setErrorMessage(error.message);
            return;
        }

        return navigate("/");
    };

    const registerOnSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        resetErrorMessage();
        setIsSubmitting(true);

        const form = event.currentTarget;
        const formValues: {[key:string]: string} = {
            displayName: form["reg_display_name_input"].value,
            email: form["reg_email_input"].value,
            password: form["reg_password_input"].value,
            passwordConfirm: form["reg_confirm_password_input"].value
        };

        const validations: [boolean, string][] = [
            [passReqs.hasSixChar, "Password should be at least 6 characters"],
            [passReqs.hasUppercase, "Password should contain at least 1 uppercase"],
            [passReqs.hasLowercase, "Password should contain at least 1 lowercase"],
            [passReqs.hasNumber, "Password should contain at least 1 number"],
            [passReqs.hasSymbol, "Password should contain at least 1 symbol"],
            [formValues.password === formValues.passwordConfirm, "Passwords don't match"]
        ];

        const validationsPassed = validations.every(vali => {
            if (!vali[0]){
                setTimeout(()=>{
                    setErrorMessage(vali[1]);
                }, 1);
                return false;
            } else return true;
        });

        if (validationsPassed){
            const {error, data} = await supabase.auth.signUp({
                email: formValues.email, password: formValues.password
            });
            if (error){
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


    return <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="flex flex-col items-center">
            <h1 className="text-xl mb-4">Continue with</h1>
            <div className="flex justify-center flex-row md:flex-col md:w-20 h-20 md:h-auto">
                <button className="oauth-provider-btn" 
                onClick={()=>providerClicked("google")}>
                    <img src={googleIcon} alt="google"/>
                </button>
                <button className="oauth-provider-btn" 
                    onClick={()=>providerClicked("github")}>
                    <img src={githubIcon} alt="github" />
                </button>
            </div>
        </div>
        <div className="m-8 text-4xl mx-32 my-12">OR</div>

        <div className="relative text-center overflow-hidden border-2 border-color-2 w-72 h-[520px]">
            <button className="btn text-xs min-w-32 absolute top-2 right-2 z-50" 
            onClick={()=>{ 
                setIsAtLogin(!isAtLogin); 
                resetErrorMessage();
            }}
            >{isAtLogin? "New user?" : "Login?"}</button>

            <div className={"auth-form right-1/2 " + (isAtLogin? "translate-x-1/2" : "-translate-x-full")}>
                <Form method="post" onSubmit={loginOnSubmit}>
                    <div className="flex flex-col">
                        <h1 className="text-center text-2xl pb-4">Login</h1>

                        <input name="form_type" type="hidden" value="LOGIN"/>
                        <label htmlFor="email_input">Email</label>
                        <input name="email_input" id="email_input" 
                            type="email" autoComplete="email" required
                            className="text-input" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <label htmlFor="password_input">Password</label>
                        <input name="password_input" id="password_input"
                            type="password" autoComplete="current-password"
                            className="text-input" value={password} onChange={(e) => setPassword(e.target.value)}/>

                        <button type="submit" disabled={isSubmitting}
                        className='btn mt-2 inline-flex justify-center'>
                            {isSubmitting ? <SpinnerSVG size={6} />: "Log in"}
                        </button>
                        <em className="text-color-4">{errorMessage}</em>
                    </div>
                </Form>
                <button className="btn text-xs mt-4" onClick={fillDemoAcc}>Fill demo account</button>
            </div>


            <div className={"auth-form left-1/2 " + (isAtLogin? "translate-x-full" : "-translate-x-1/2")}>
                <Form method="post" onSubmit={registerOnSubmit}>
                    <div className="flex flex-col">
                        <h1 className="text-center text-2xl pb-4">Register</h1>

                        <input name="form_type" type="hidden" value="REGISTER"/>
                        <label htmlFor="reg_display_name_input">Display name</label>
                        <input name="reg_display_name_input" id="reg_display_name_input"
                            type="text" required
                            className="text-input" />
                        <label htmlFor="reg_email_input">Email</label>
                        <input name="reg_email_input" id="reg_email_input"
                            type="email" autoComplete="email" required
                            className="text-input" />

                        {/* Password requirements popup div */}
                        <div className="relative">
                            <div hidden={!showPassReqs} className="absolute bottom-0 
                            border-2 rounded-md border-color-2 bg-color-1 
                            w-full p-2">
                                <p className={passReqs.hasSixChar?"line-through":""}>
                                    At least 6 characters</p>
                                <p className={passReqs.hasUppercase?"line-through":""}>
                                    At least 1 uppercase</p>
                                <p className={passReqs.hasLowercase?"line-through":""}>
                                    At least 1 lowercase</p>
                                <p className={passReqs.hasNumber?"line-through":""}>
                                    At least 1 number</p>
                                <p className={passReqs.hasSymbol?"line-through":""}>
                                    At least 1 symbol</p>
                            </div>
                        </div>

                        <label htmlFor="reg_password_input">Password</label>
                        <input name="reg_password_input" id="reg_password_input"
                            type="password" autoComplete="new-password"
                            className="text-input" required 
                            onFocus={()=>setShowPassReqs(true)}
                            onBlur={()=>setShowPassReqs(false)}
                            onChange={e=>setRegPassword(e.target.value)}
                            value={regPassword}/>
                        <label htmlFor="reg_confirm_password_input">Confirm password</label>
                        <input name="reg_confirm_password_input" id="reg_confirm_password_input" 
                            type="password" autoComplete="new-password"
                            className="text-input" required />
                        <em className="text-color-4">{errorMessage}</em>

                        <button type="submit" disabled={isSubmitting}
                        className='btn mt-2 inline-flex justify-center'>
                            {isSubmitting ? <SpinnerSVG size={6} />: "Sign up"}
                        </button>
                    </div>
                </Form>
            </div>

        </div>

    </div>
}

