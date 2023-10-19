
import type { LinksFunction } from "@remix-run/node";
import type { Database } from '../database.types'

import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator
} from "@remix-run/react";
import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/auth-helpers-remix'

import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader(){
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  }
  return json({ env })
}


export default function App() {
  const { env } = useLoaderData<typeof loader>()
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  )

  const revalidator = useRevalidator()
  // recalling loaders when authentication state changes
  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      revalidator.revalidate()
    })
  
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, revalidator])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet  context={{ supabase }}  />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
