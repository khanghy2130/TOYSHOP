import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function retrievePaymentIntent(id: string) {
    return await stripe.paymentIntents.retrieve(id);
}

export async function createPaymentIntent() {
    return await stripe.paymentIntents.create({
        amount: 2000,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });
}
