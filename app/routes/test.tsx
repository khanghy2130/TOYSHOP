
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { createServerClient, parse, serialize } from '@supabase/ssr';
import { json } from "@remix-run/node";

import type { Database } from '../../database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { LoaderFunctionArgs } from "@remix-run/node"
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
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

    // const data = await supabase.from('profiles').select()
    const { // if user !== null then is authenticated
        data: { user: data },
      } = await supabase.auth.getUser() 
  
    return new Response(JSON.stringify(data), {headers})

}


export default function Test(){

    const { supabase } = useOutletContext<{ supabase: SupabaseClient<Database> }>()

    ////// get data from server side (in loaders and actions)
    const data = useLoaderData() as string
    useEffect(()=>{
        console.log(JSON.parse(data))
    }, [])


    ////// get data from client side
    // useEffect(() => {
    //     (async () => {
    //         const data = await supabase.from('profiles').select()
    //         console.log(data)
    //     })()
    // }, [])


    function signUp(){
        supabase.auth.signUp({
            email: "khanghy2130@gmail.com",
            password: "sup3rs3cur3"
        })
    }

    function logIn(){
        supabase.auth.signInWithPassword({
            email: "khanghy2130@gmail.com",
            password: "sup3rs3cur3"
        })
    }

    function signOut(){
        supabase.auth.signOut()
    }

    return <div>
        <button onClick={signUp}>Sign up</button>
        <button onClick={logIn}>Log in</button>
        <button onClick={signOut}>Sign out</button>
    </div>
}