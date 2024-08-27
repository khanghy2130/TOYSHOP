import { useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ContextProps } from "~/utils/types/ContextProps.type";

import { Tables } from "database.types";
import OrderModal from "./OrderModal";

export default function OrdersPage() {
    const { supabase, user } = useOutletContext<ContextProps>();
    const [orders, setOrders] = useState<Tables<"ORDERS">[]>([]);

    const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    function orderClicked(orderId: number) {
        setShowOrderModal(true);
        setSelectedOrderId(orderId);
    }

    // fetch orders if logged in
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
        })();
    }, []);

    if (!user) {
        ////////
        return <div>Not logged in</div>;
    }

    return (
        <div>
            <h1>Orders</h1>
            <p>Click to open modal</p>
            <div className="flex flex-col">
                {orders.map((order) => (
                    <button
                        className="btn"
                        key={order.id}
                        onClick={() => orderClicked(order.id)}
                    >
                        order: {new Date(order.created_at).toDateString()}
                    </button>
                ))}
            </div>
            <OrderModal
                supabase={supabase}
                showOrderModal={showOrderModal}
                setShowOrderModal={setShowOrderModal}
                selectedOrderId={selectedOrderId}
            />
        </div>
    );
}
