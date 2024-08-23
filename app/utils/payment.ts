import Stripe from "stripe";
import { CartItem } from "~/routes/cart/CartItemType";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function retrievePaymentIntent(id: string) {
    return await stripe.paymentIntents.retrieve(id);
}

type ShortCartItem = {
    title: string;
    quantity: number;
    finalCost: number;
};

export type CreatePaymentInfoReturnType = {
    paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
    shortCartItems: ShortCartItem[];
    totalCost: number;
};

export async function createPaymentInfo(
    cartItems: CartItem[],
): Promise<CreatePaymentInfoReturnType> {
    const shortCartItems: ShortCartItem[] = cartItems.map((ci) => {
        const singleCost =
            ci.product.price - (ci.product.price * ci.product.discount) / 100;
        return {
            title: ci.product.title,
            quantity: ci.quantity,
            finalCost: Math.floor(singleCost * ci.quantity * 100) / 100,
        };
    });

    const totalCost = shortCartItems.reduce(
        (accumulator, cartItem) => accumulator + cartItem.finalCost,
        0,
    );

    const paymentIntent = await stripe.paymentIntents.create({
        // amount must be int, 150 would be $1.50
        amount: Math.floor(totalCost * 100),
        currency: "usd",
        metadata: {
            cartItems: JSON.stringify(shortCartItems),
        },
    });

    return {
        paymentIntent,
        shortCartItems,
        totalCost: Math.floor(totalCost * 100) / 100,
    };
}
