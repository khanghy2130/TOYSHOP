import { Link, Form, useOutletContext } from "@remix-run/react";
import { useState } from "react";


import googleIcon from "~/assets/oauth_providers/google-icon.png";
import facebookIcon from "~/assets/oauth_providers/facebook-icon.png";
import githubIcon from "~/assets/oauth_providers/github-icon.png";


import type { Database } from '../../database.types'
import type { SupabaseClient, Provider } from '@supabase/supabase-js'

export const loader = () => {

    return {};
};

export default function Login(){
    const [isAtLogin, setIsAtLogin] = useState<boolean>(true);
    const { supabase } = useOutletContext<{ supabase: SupabaseClient<Database> }>()

    const providerClicked = async (providerName: Provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: providerName
        });
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
                onClick={()=>providerClicked("facebook")}>
                    <img src={facebookIcon} alt="facebook" />
                </button>
                <button className="oauth-provider-btn" 
                onClick={()=>providerClicked("github")}>
                    <img src={githubIcon} alt="github" />
                </button>
            </div>
        </div>
        <div className="m-8 text-4xl mx-32 my-12">OR</div>

        <div className="relative text-center overflow-hidden border-2 border-color-2 rounded-lg w-80 h-96">
            <button className="btn" onClick={()=>setIsAtLogin(!isAtLogin)}
            >{isAtLogin? "[Login]/Signup" : "Login/[Signup]"}</button>

            <div className={"auth-form " + (isAtLogin? "-translate-x-1/2" : "-translate-x-[200%]")}>
                <Form action="/events" method="post">
                    <div className="flex flex-col">

                        <label htmlFor="email_input">Email</label>
                        <input id="email_input" type="email" autoComplete="email"/>
                        <label htmlFor="password_input">Password</label>
                        <input id="password_input" type="password" autoComplete="current-password" />

                        <button type="submit" className='btn'>Log In</button>
                    </div>
                </Form>
                <button className="underline">Fill demo account</button>
            </div>


            <div className={"auth-form " + (isAtLogin? "translate-x-full" : "-translate-x-1/2")}>
                <Form action="/events" method="post">
                    <div className="flex flex-col">

                        <label htmlFor="email_input">Email</label>
                        <input id="email_input" type="email" autoComplete="email"/>
                        <label htmlFor="password_input">Password</label>
                        <input id="password_input" type="password" autoComplete="new-password" />
                        <label htmlFor="confirm_password_input">Confirm password</label>
                        <input id="confirm_password_input" type="password" autoComplete="new-password"/>

                        <button type="submit" className='btn'>Sign up</button>
                    </div>
                </Form>
            </div>

        </div>

    </div>
}

