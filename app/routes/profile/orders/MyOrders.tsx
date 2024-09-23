import { useOutletContext, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";

import { Tables } from "database.types";
import OrderModal from "./OrderModal";

export default function MyOrders() {
    const { supabase, user } = useOutletContext<ContextProps>();
    const [orders, setOrders] = useState<Tables<"ORDERS">[]>([]);

    const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<Tables<"ORDERS"> | null>(
        null,
    );

    const [searchParams, setSearchParams] = useSearchParams();

    function orderClicked(order: Tables<"ORDERS">) {
        setShowOrderModal(true);
        setSelectedOrder(order);
    }

    // fetch orders
    useEffect(() => {
        if (!user) return;
        (async function () {
            const { data, error } = await supabase
                .from("ORDERS")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching orders", error);
                return;
            }

            setOrders(data);

            // view order? open lastest order & remove query
            const viewOrder = searchParams.get("viewOrder");
            if (viewOrder === "true") {
                setShowOrderModal(true);
                setSelectedOrder(data[0]);
                searchParams.delete("viewOrder");
                setSearchParams(searchParams);
            }
        })();
    }, []);

    return (
        <div className="mt-6 w-full">
            <h1 className="mb-2 text-2xl font-medium text-textColor1">
                My orders
            </h1>
            <div className="flex h-96 flex-col overflow-auto text-xl sm:text-2xl">
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
