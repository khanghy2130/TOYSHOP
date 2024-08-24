import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";
// import { LoaderFunctionArgs } from "@remix-run/node";
// import { retrievePaymentIntent } from "~/utils/payment";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//     const url = new URL(request.url);
//     const id: string = url.searchParams.get("payment_intent")!;
//     return await retrievePaymentIntent(id);
// };

export default function PaySuccessPage() {
    // const paymentIntent = useLoaderData();

    const { saveOrder } = useOutletContext() as {
        saveOrder: Function;
    };
    useEffect(() => {
        saveOrder();
    }, []);

    return (
        <div>
            <h1>Payment successful</h1>
            <Link to="/orders">
                <button className="btn">See all orders</button>
            </Link>
        </div>
    );
}
