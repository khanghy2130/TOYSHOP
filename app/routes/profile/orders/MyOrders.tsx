import { useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { Tables } from "database.types";
import OrderModal from "./OrderModal";
import { loaderDataReturnType } from "..";

type Props = {
    ordersData: loaderDataReturnType["ordersData"] | undefined;
};

export default function MyOrders({ ordersData }: Props) {
    const [orders, setOrders] = useState<Tables<"ORDERS">[]>(ordersData || []);

    const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<Tables<"ORDERS"> | null>(
        null,
    );

    const [searchParams, setSearchParams] = useSearchParams();

    function orderClicked(order: Tables<"ORDERS">) {
        setShowOrderModal(true);
        setSelectedOrder(order);
    }

    const [highlighted, setHighlighted] = useState<boolean>(false);
    const highlightedRef = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
        const highlightWishlist = searchParams.get("orders");
        setHighlighted(highlightWishlist === "true");

        const timeoutId = setTimeout(() => {
            if (highlightWishlist === "true") {
                highlightedRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [searchParams]);

    useEffect(() => {
        // view order? open lastest order & remove query
        const viewOrder = searchParams.get("viewOrder");
        if (viewOrder === "true" && orders[0]) {
            setShowOrderModal(true);
            setSelectedOrder(orders[0]);
            searchParams.delete("viewOrder");
            setSearchParams(searchParams);
        }
    }, []);

    return (
        <div className="mt-6 w-full">
            <h1 className="mb-2 text-2xl font-medium text-textColor1">
                <span
                    ref={highlightedRef}
                    className={`${highlighted ? "bg-yellow-500 bg-opacity-20 transition duration-150" : ""}`}
                >
                    My orders
                </span>
            </h1>
            <div className="flex max-h-96 flex-col overflow-auto text-lg sm:text-xl">
                {orders.length === 0 ? (
                    <p className="w-full text-center text-lg">
                        No orders found.
                    </p>
                ) : null}
                {orders.map((order) => (
                    <button
                        className="flex justify-between bg-bgColor2 px-3 py-2 text-textColor1 hover:bg-bgColor3 hover:text-primaryColor sm:px-5"
                        key={order.id}
                        onClick={() => orderClicked(order)}
                    >
                        <span className="underline">Order #{order.id}</span>
                        <span className="ms-3 text-lg text-textColor2">
                            {new Date(order.created_at).toLocaleDateString()}
                        </span>
                    </button>
                ))}
            </div>
            {showOrderModal ? (
                <OrderModal
                    setShowOrderModal={setShowOrderModal}
                    selectedOrder={selectedOrder}
                />
            ) : null}
        </div>
    );
}
