import { Link, useOutletContext } from "@remix-run/react";
import { ContextProps } from "~/utils/types/ContextProps.type";

export default function Profile() {
    const { supabase, user } = useOutletContext<ContextProps>();

    // unauthenticated render
    if (!user) {
        return (
            <div>
                <h1>Log in to see your profile.</h1>
                <Link to="/login">
                    <button className="btn">Login</button>
                </Link>
            </div>
        );
    }

    // authenticated render
    return (
        <div>
            <h1 className="text-3xl">
                My Profile (no one else can see my profile)
            </h1>
            <p>UUID: {user.id}</p>
            <p>Name: {user.user_metadata.full_name}</p>
            <p>Email: {user.user_metadata.email}</p>
        </div>
    );
}
