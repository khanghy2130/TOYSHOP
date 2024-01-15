import { Link, Form, useOutletContext, useActionData, redirect } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";
import { createServerClient, parse, serialize } from '@supabase/ssr';


import googleIcon from "~/assets/oauth_providers/google-icon.png";
import facebookIcon from "~/assets/oauth_providers/facebook-icon.png";
import githubIcon from "~/assets/oauth_providers/github-icon.png";


import type { Database } from '../../database.types'
import type { SupabaseClient, Provider } from '@supabase/supabase-js'
import type { ActionFunctionArgs } from "@remix-run/node"


export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();

    const cookies = parse(request.headers.get('Cookie') ?? '')
    const headers = new Headers()
    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        cookies: {
          get(key) {
            return cookies[key]
          },
          set(key, value, options) {
            headers.append('Set-Cookie', serialize(key, value, options))
          },
          remove(key, options) {
            headers.append('Set-Cookie', serialize(key, '', options))
          },
        },
    })
    
    // LOGIN
    if (formData.get("form_type") === "LOGIN"){        
        const {error} = await supabase.auth.signInWithPassword({
            email: String(formData.get("email_input")), 
            password: String(formData.get("password_input"))
        })
        if (error) return json({ errorMessage: error.message });
        return redirect("/");
    }

    // REGISTER
    else if (formData.get("form_type") === "REGISTER") {
        const displayName = String(formData.get("reg_display_name_input"));
        const email = String(formData.get("reg_email_input"));
        const password = String(formData.get("reg_password_input"));
        const passwordConfirm = String(formData.get("reg_confirm_password_input"));


        let errorMessage: string | null = null;
        const validations : [boolean, string][] = [
            [!email.includes("@") || !email.includes("."), "Invalid email address."],
            [password.length < 6, "Password should be at least 6 characters."],
            [!(/[A-Z]/.test(password)), "Password should contain at least 1 uppercase."],
            [!(/[a-z]/.test(password)), "Password should contain at least 1 lowercase."],
            [!(/\d/.test(password)), "Password should contain at least 1 number."],
            [!(/[!@#$%^&*()_+={}\[\]:;<>,.?~\\|\-]/.test(password)), "Password should contain at least 1 symbol."],
            [password !== passwordConfirm, "Confirm password doesn't match."]
        ];
        validations.some(vali => {
            if (vali[0]){
                errorMessage = vali[1];
                return true;
            } else return false;
        });

        // const d = await supabase.auth.getUser()
        // console.log(d)
        // const s = await supabase.auth.getSession()
        // console.log(s)
      
        if (errorMessage) return json({ errorMessage });
        const {error} = await supabase.auth.signUp({email, password});
        if (error) json({ errorMessage: "Error: Failed to register." });
        
        return redirect("/");
    }

    return json({ errorMessage: "Unknown form submitted." });
  }


export default function Login(){
    
    const actionData = useActionData<typeof action>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const resetErrorMessage = () => setErrorMessage(null);
    // update errorMessage on form submission
    useEffect(()=>{
        if (actionData?.errorMessage){
            setErrorMessage(actionData.errorMessage);
        }
    }, [actionData]);


    // switch between login & signup
    const [isAtLogin, setIsAtLogin] = useState<boolean>(true);
    const { supabase } = useOutletContext<{ supabase: SupabaseClient<Database> }>()

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
        setPassword("sup3rs3cur3");
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

        <div className="relative text-center overflow-hidden border-2 border-color-2 w-72 h-[520px]">
            <button className="btn text-xs min-w-32 absolute top-2 right-2 z-50" 
            onClick={()=>{ 
                setIsAtLogin(!isAtLogin); 
                resetErrorMessage();
            }}
            >{isAtLogin? "New user?" : "Login?"}</button>

            <div className={"auth-form right-1/2 " + (isAtLogin? "translate-x-1/2" : "-translate-x-full")}>
                <Form method="post" onSubmit={resetErrorMessage}>
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

                        <button type="submit" className='btn'>Log In</button>
                        <em className="text-color-4">{errorMessage}</em>
                    </div>
                </Form>
                <button className="btn text-xs mt-4" onClick={fillDemoAcc}>Fill demo account</button>
            </div>


            <div className={"auth-form left-1/2 " + (isAtLogin? "translate-x-full" : "-translate-x-1/2")}>
                <Form method="post" onSubmit={resetErrorMessage}>
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

                        <button type="submit" className='btn'>Sign up</button>
                    </div>
                </Form>
            </div>

        </div>

    </div>
}

