import { json, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent } from "react";

export const loader: LoaderFunction = async () => {
    const data: { env: { [key: string]: string } } = {
        env: {
            STRIPE_RETURN_URL: process.env.STRIPE_RETURN_URL!,
        },
    };
    return json(data);
};

export default function PayPageDefault() {
    const elements = useElements();
    const stripe = useStripe();

    const { env } = useLoaderData<LoaderFunction>();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await stripe?.confirmPayment({
            elements: elements!,
            confirmParams: {
                return_url: env.STRIPE_RETURN_URL!,
            },
        });
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <PaymentElement />
                <button className="btn">Pay</button>
            </Form>
        </div>
    );
}
