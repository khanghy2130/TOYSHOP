import { json, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import SpinnerSVG from "~/components/SpinnerSVG";

export const loader: LoaderFunction = async () => {
    const data: { env: { [key: string]: string } } = {
        env: {
            SITE_URL: process.env.SITE_URL!,
        },
    };
    return json(data);
};

export default function PayPageDefault() {
    const elements = useElements();
    const stripe = useStripe();

    const [paymentInProcess, setPaymentInProcess] = useState<boolean>(false);
    const { env } = useLoaderData<LoaderFunction>();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setPaymentInProcess(true);

        await stripe?.confirmPayment({
            elements: elements!,
            confirmParams: {
                return_url: env.SITE_URL! + "/pay/success",
            },
        });
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <p className="mb-4 bg-yellow-500 bg-opacity-30 px-2 text-lg">
                    <span className="font-bold">Note: </span>
                    this is a demo project, do not enter real information. To
                    test payment, please enter card number 4242 4242 4242 4242
                    and any valid value for the rest.
                </p>
                <PaymentElement />
                <div className="mt-6 flex w-full justify-center">
                    {paymentInProcess ? (
                        <div className="h-12 w-12 text-primaryColor">
                            <SpinnerSVG />
                        </div>
                    ) : (
                        <button
                            disabled={paymentInProcess}
                            className="rounded-lg bg-primaryColor px-10 py-2 text-xl font-medium text-primaryTextColor hover:bg-primaryColorMuted"
                        >
                            Pay
                        </button>
                    )}
                </div>
            </Form>
        </div>
    );
}
