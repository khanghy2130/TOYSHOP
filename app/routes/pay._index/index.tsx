import { Form } from "@remix-run/react";
import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent } from "react";

export default function PayPageDefault() {
    const elements = useElements();
    const stripe = useStripe();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await stripe?.confirmPayment({
            elements: elements!,
            confirmParams: {
                return_url: "http://localhost:3000/pay/success",
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
