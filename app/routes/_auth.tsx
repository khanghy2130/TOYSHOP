import { Outlet } from "@remix-run/react";


export default function AuthLayout(){
    return <div>
        Auth layout
        <Outlet/>
    </div>
}