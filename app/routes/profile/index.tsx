import { Link, useOutletContext } from "@remix-run/react";

import { ContextProps } from "~/utils/types/ContextProps.type";
import MyWishlist from "./wishlist/MyWishlist";
import MyOrders from "./orders/MyOrders";
import MyReviews from "./reviews/MyReviews";
import ProfileInfo from "./profile_info/ProfileInfo";

export default function Profile() {
    const { user } = useOutletContext<ContextProps>();

    /*
    const location = useLocation();
    // scroll to element
    useEffect(() => {
        if (!hasScrolled && location.hash) {
            const elementId = location.hash.replace("#", "");
            const element = document.getElementById(elementId);
            if (element) element.scrollIntoView({ behavior: "smooth" });
        }
    }, [hasScrolled, location.hash]);
    */

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

    return (
        <div className="relative flex w-full max-w-[1200px] flex-col md:flex-row md:items-start">
            <ProfileInfo />

            <div className="mt-10 flex flex-grow flex-col px-4 md:mt-0">
                <MyWishlist />
                <MyOrders />
                <MyReviews />
            </div>
        </div>
    );
}
