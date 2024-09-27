import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "~/utils/Navbar/ThemeProvider";
import {
    createPaymentInfo,
    CreatePaymentInfoReturnType,
} from "~/utils/payment";
import { CartItemType } from "../cart/CartItemType";
import { ContextProps } from "~/utils/types/ContextProps.type";
import { useState } from "react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import {
    createServerClient,
    parseCookieHeader,
    serializeCookieHeader,
} from "@supabase/ssr";
import Stripe from "stripe";
import OrderDetails from "./OrderDetails";

import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [{ title: "Checkout" }];
};

// public key doesn't need to be hidden
const stripePromise = loadStripe(
    "pk_test_51PpgFh089fO0rbrj5R1T7614VbTjH5UJeu5DYHsQrP9Qf6dIoG5tds3sWx0knaV2mahirYa0jx57sWMhUismcAy100DdTwGfCm",
);

export async function loader({ request }: LoaderFunctionArgs) {
    const headers = new Headers();
    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return parseCookieHeader(
                        request.headers.get("Cookie") ?? "",
                    );
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        headers.append(
                            "Set-Cookie",
                            serializeCookieHeader(name, value, options),
                        ),
                    );
                },
            },
        },
    );

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

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
                product:PRODUCTS (
                    id,
                    title,
                    price_with_discount,
                    quantity
                )
            `,
        )
        .eq("user_id", user.id)
        .returns<CartItemType[]>();

    if (cartItemsError) {
        console.error("Error fetching items in cart", cartItemsError);
        return redirect("/cart");
    }
    // empty cart?
    if (cartItems.length === 0) {
        return null;
    }

    // look for any item that is insufficient in stock
    let insufficientStockItem: null | string = null;
    cartItems.some((ci) => {
        if (!ci.product) return false;
        if (ci.product.quantity < ci.quantity) {
            insufficientStockItem = ci.product.title;
            return true;
        }
        return false;
    });
    if (insufficientStockItem) {
        return redirect("/cart?insufficientStockItem=" + insufficientStockItem);
    }

    const paymentIntent = await createPaymentInfo(cartItems, user);
    return paymentIntent;
}

export default function PayPage() {
    const { supabase, user, setRawCartItems, addNotification } =
        useOutletContext<ContextProps>();

    const [theme] = useTheme();
    const loaderData = useLoaderData() as CreatePaymentInfoReturnType | null;
    const paymentIntent:
        | CreatePaymentInfoReturnType["paymentIntent"]
        | undefined = loaderData?.paymentIntent;
    const shortCartItems:
        | CreatePaymentInfoReturnType["shortCartItems"]
        | undefined = loaderData?.shortCartItems;

    const [startedSavingNewOrder, setStartedSavingNewOrder] =
        useState<boolean>(false);

    async function saveOrder(
        paidPaymentIntent: Stripe.Response<Stripe.PaymentIntent>,
    ) {
        if (startedSavingNewOrder || !paymentIntent || !user || !shortCartItems)
            return;
        setStartedSavingNewOrder(true);

        // create new order
        const { data: orderData, error: orderError } = await supabase
            .from("ORDERS")
            .insert({
                user_id: user.id,
                payment_id: paidPaymentIntent.id,
                total_amount: paymentIntent.amount / 100,
            })
            .select()
            .single();

        if (orderError) {
            // ignore duplicate order error
            if (orderError.code === "23505") return;
            console.error("Error creating new order", orderError);
            addNotification("Error creating new order", "FAIL");
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
            addNotification("Error inserting order items", "FAIL");
            return;
        }

        clearCart();
        addNotification("Order added", "SUCCESS");
    }

    async function clearCart() {
        if (!user) return;

        const { error: deleteCartError } = await supabase
            .from("CARTS")
            .delete()
            .eq("user_id", user.id);

        if (deleteCartError) {
            console.error("Error deleting cart items", deleteCartError);
            addNotification("Error deleting cart items", "FAIL");
            return;
        }

        setRawCartItems([]); // clear raw cart state
    }

    if (startedSavingNewOrder || !paymentIntent || !shortCartItems) {
        return (
            <div>
                <Outlet context={{ saveOrder }} />
            </div>
        );
    }

    return (
        <div className="flex w-full max-w-[800px] flex-col px-2">
            <OrderDetails
                shortCartItems={shortCartItems}
                paymentIntent={paymentIntent}
            />
            <div className="w-full">
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
