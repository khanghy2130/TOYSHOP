import { User } from "@supabase/supabase-js";
import Stripe from "stripe";
import { CartItemType } from "~/routes/cart/CartItemType";

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
    cartItems: CartItemType[],
    user: User,
): Promise<CreatePaymentInfoReturnType> {
    let shortCartItems: ShortCartItem[] = [];
    // create shorten cart items
    for (let i = 0; i < cartItems.length; i++) {
        const ci = cartItems[i];
        // assert non null
        if (!ci.product || !ci.product.price_with_discount) continue;
        shortCartItems.push({
            id: ci.product.id,
            title: ci.product.title,
            quantity: ci.quantity,
            subtotal: ci.quantity * ci.product.price_with_discount,
        });
    }

    const totalCost = shortCartItems.reduce(
        (accumulator, shortCartItem) => accumulator + shortCartItem.subtotal,
        0,
    );

    const paymentIntent = await stripe.paymentIntents.create({
        // amount must be int, $1.50 would be 150 (multiply by 100)
        amount: Math.round(totalCost * 100),
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
