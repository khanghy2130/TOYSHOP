import { SupabaseClient } from "@supabase/supabase-js";
import { Tables } from "database.types";
import { useEffect, useState } from "react";
import OrderItem from "./OrderItem";

type Props = {
    supabase: SupabaseClient;
    showOrderModal: boolean;
    setShowOrderModal: SetState<boolean>;
    selectedOrderId: number | null;
};

export default function OrderModal({
    supabase,
    showOrderModal,
    setShowOrderModal,
    selectedOrderId,
}: Props) {
    const [orderItems, setOrderItems] = useState<Tables<"ORDERS_ITEMS">[]>([]);

    // fetch order-items for selected order
    useEffect(() => {
        if (selectedOrderId === null) return;

        (async function () {
            const { data, error } = await supabase
                .from("ORDERS_ITEMS")
                .select("*")
                .eq("order_id", selectedOrderId)
                .returns<Tables<"ORDERS_ITEMS">[]>();

            if (error) {
                console.error("Error fetching order items", error);
                return;
            }

            setOrderItems(data);
        })();
    }, [selectedOrderId]);

    if (!showOrderModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="h-3/4 w-11/12 max-w-[600px] overflow-y-scroll bg-color-1">
                <div className="flex flex-row">
                    <h1>Order: {selectedOrderId}</h1>
                    <button
                        className="btn"
                        onClick={() => setShowOrderModal(false)}
                    >
                        Close
                    </button>
                </div>

                <div>
                    {orderItems.map((orderItem) => (
                        <OrderItem key={orderItem.id} orderItem={orderItem} />
                    ))}
                </div>
            </div>
        </div>
    );
}
