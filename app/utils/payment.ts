import { User } from "@supabase/supabase-js";
import Stripe from "stripe";
import { CartItem } from "~/routes/cart/CartItemType";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function retrievePaymentIntent(id: string) {
    return await stripe.paymentIntents.retrieve(id);
}

// cart item with fewer data & calculated subtotal
type ShortCartItem = {
    id: number;
    title: string;
    quantity: number;
    subtotal: number;
};

export type CreatePaymentInfoReturnType = {
    paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
    shortCartItems: ShortCartItem[];
};

export async function createPaymentInfo(
    cartItems: CartItem[],
    user: User,
): Promise<CreatePaymentInfoReturnType> {
    const shortCartItems: ShortCartItem[] = cartItems.map((ci) => {
        const singleCost =
            ci.product.price - (ci.product.price * ci.product.discount) / 100;
        return {
            id: ci.product.id,
            title: ci.product.title,
            quantity: ci.quantity,
            subtotal: Math.floor(singleCost * ci.quantity * 100) / 100,
        };
    });

    const totalCost = shortCartItems.reduce(
        (accumulator, cartItem) => accumulator + cartItem.subtotal,
        0,
    );

    const paymentIntent = await stripe.paymentIntents.create({
        // amount must be int, 150 would be $1.50
        amount: Math.floor(totalCost * 100),
        currency: "usd",
        receipt_email: user.email,
        metadata: {
            customer_id: user.id,
            cart_items: JSON.stringify(shortCartItems),
        },
    });

    return {
        paymentIntent,
        shortCartItems,
    };
}
