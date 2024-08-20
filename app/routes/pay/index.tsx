import { Outlet, useLoaderData } from "@remix-run/react";
import Stripe from "stripe";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "~/utils/Navbar/ThemeProvider";
import { createPaymentIntent } from "~/utils/payment";

// public key doesn't need to be hidden
const stripePromise = loadStripe(
    "pk_test_51PpgFh089fO0rbrj5R1T7614VbTjH5UJeu5DYHsQrP9Qf6dIoG5tds3sWx0knaV2mahirYa0jx57sWMhUismcAy100DdTwGfCm",
);

export const loader = async () => {
    return await createPaymentIntent();
};

export default function PayPage() {
    const paymentIntent =
        useLoaderData() as Stripe.Response<Stripe.PaymentIntent>;

    const [theme] = useTheme();

    return (
        <div>
            <p>Pay page</p>
            <div className="w-1/2">
                <Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret: paymentIntent.client_secret as string,
                        appearance: {
                            theme: theme === "dark" ? "night" : "stripe",
                            labels: "floating",
                        },
                    }}
                >
                    <Outlet />
                </Elements>
            </div>
        </div>
    );
}
