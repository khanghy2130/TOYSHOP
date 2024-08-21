import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { retrievePaymentIntent } from "~/utils/payment";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const id: string = url.searchParams.get("payment_intent")!;
    return await retrievePaymentIntent(id);
};

export default function PaySuccessPage() {
    const paymentIntent = useLoaderData();
    //// save paymentIntent ID to db!
    return (
        <div>
            <h1>Payment successful</h1>
            <pre>{JSON.stringify(paymentIntent, null, 2)}</pre>
        </div>
    );
}
