import {
    Link,
    Outlet,
    useLoaderData,
    useOutletContext,
} from "@remix-run/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "~/utils/Navbar/ThemeProvider";
import {
    createPaymentInfo,
    CreatePaymentInfoReturnType,
} from "~/utils/payment";
import { CartItem } from "../cart/CartItemType";
import { ContextProps } from "~/utils/types/ContextProps.type";
import { useEffect, useRef, useState } from "react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { parse } from "cookie";
import { createClient } from "@supabase/supabase-js";

// public key doesn't need to be hidden
const stripePromise = loadStripe(
    "pk_test_51PpgFh089fO0rbrj5R1T7614VbTjH5UJeu5DYHsQrP9Qf6dIoG5tds3sWx0knaV2mahirYa0jx57sWMhUismcAy100DdTwGfCm",
);

export async function loader({ request }: LoaderFunctionArgs) {
    const cookies = parse(request.headers.get("Cookie")!);

    let accessToken = null;
    const tokenMatch = JSON.stringify(cookies).match(
        /\\"access_token\\":\\"(.*?)\\"/,
    );
    if (tokenMatch) accessToken = tokenMatch[1];
    if (accessToken === null) return redirect("/login");

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
        },
    );

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
        console.error("Error fetching user", userError);
        return redirect("/login");
    }

    const { data: cartItems, error: cartItemsError } = await supabase
        .from("CARTS")
        .select(
            `
                id,
                quantity,
                product:product_id (
                    id,
                    title,
                    price,
                    discount
                )
            `,
        )
        .eq("user_id", user.id)
        .returns<CartItem[]>();

    if (cartItemsError) {
        console.error("Error fetching items in cart", cartItemsError);
        return redirect("/login");
    }
    // empty cart?
    if (cartItems.length === 0) {
        return redirect("/store");
    }

    return await createPaymentInfo(cartItems, user);
}

export default function PayPage() {
    const { supabase } = useOutletContext<ContextProps>();

    const [theme] = useTheme();
    const loaderData = useLoaderData() as CreatePaymentInfoReturnType;
    const { userId, paymentIntent, shortCartItems, totalCost } = loaderData;
    const orderIsSaved = useRef<boolean>(false);

    // clear cart if saved order when unmount
    useEffect(() => {
        return () => {
            if (orderIsSaved.current) clearCart();
        };
    }, []);

    async function saveOrder() {
        // create new order
        const { data: orderData, error: orderError } = await supabase
            .from("ORDERS")
            .insert({
                user_id: userId,
                payment_id: paymentIntent.id,
                total_amount: totalCost,
            })
            .select()
            .single();

        if (orderError) {
            console.error("Error creating new order", orderError);
            return;
        }

        const orderItems = shortCartItems.map((sci) => ({
            order_id: orderData.id,
            product_id: sci.id,
            title: sci.title,
            quantity: sci.quantity,
            subtotal: sci.subtotal,
        }));

        // save items in carts to order
        const { error: itemsError } = await supabase
            .from("ORDERS_ITEMS")
            .insert(orderItems);

        if (itemsError) {
            console.error("Error inserting order items", itemsError);
            return;
        }

        orderIsSaved.current = true;
    }

    async function clearCart() {
        const { error: deleteCartError } = await supabase
            .from("CARTS")
            .delete()
            .eq("user_id", userId);

        if (deleteCartError) {
            console.error("Error deleting cart items", deleteCartError);
            return;
        }
    }

    if (!paymentIntent || !shortCartItems) {
        return <div>Error: server didn't give expected results</div>;
    }

    return (
        <div>
            <p>(COMPONENT) receipt listing and total cost ${totalCost}</p>
            {shortCartItems.map((cartItem, i) => (
                <div key={i}>product: {cartItem.title}</div>
            ))}
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
                    <Outlet context={{ saveOrder }} />
                </Elements>
            </div>
        </div>
    );
}
