import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { retrievePaymentIntent } from "~/utils/payment";
import Stripe from "stripe";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const id: string = url.searchParams.get("payment_intent")!;
    return await retrievePaymentIntent(id);
};

export default function PaySuccessPage() {
    const paidPaymentIntent =
        useLoaderData() as Stripe.Response<Stripe.PaymentIntent>;

    const { saveOrder } = useOutletContext() as {
        saveOrder: Function;
    };
    useEffect(() => {
        saveOrder(paidPaymentIntent);
        document.title = "Thank you!";
    }, []);

    return (
        <div className="flex w-full max-w-96 flex-col items-center justify-center px-2 py-20">
            <h1 className="flex items-center text-center text-2xl sm:text-3xl">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8 text-green-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                </svg>
                <span className="ms-2">Payment successful</span>
            </h1>
            <h1 className="w-full text-right text-xl sm:text-2xl">
                ${(paidPaymentIntent.amount / 100).toFixed(2)}
            </h1>
            <Link to="/profile?viewOrder=true">
                <button className="mt-6 rounded-lg bg-primaryColor px-6 py-2 text-lg font-medium text-primaryTextColor hover:bg-primaryColorMuted">
                    View order
                </button>
            </Link>
        </div>
    );
}
