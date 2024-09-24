import { Tables } from "database.types";
import { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import { useOutletContext } from "@remix-run/react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = {
    setShowOrderModal: SetState<boolean>;
    selectedOrder: Tables<"ORDERS"> | null;
};

export default function OrderModal({
    setShowOrderModal,
    selectedOrder,
}: Props) {
    const { supabase } = useOutletContext<ContextProps>();
    const [orderItems, setOrderItems] = useState<Tables<"ORDERS_ITEMS">[]>([]);

    // fetch order-items for selected order
    useEffect(() => {
        if (!selectedOrder) return;
        (async function () {
            const { data, error } = await supabase
                .from("ORDERS_ITEMS")
                .select("*")
                .eq("order_id", selectedOrder.id)
                .returns<Tables<"ORDERS_ITEMS">[]>();

            if (error) {
                console.error("Error fetching order items", error);
                return;
            }

            setOrderItems(data);
        })();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-color-1 flex h-5/6 w-11/12 max-w-[800px] flex-col rounded-lg border-2 border-textColor2 bg-bgColor1">
                {/* Modal header */}
                <div className="flex w-full flex-row border-b-2 border-textColor2">
                    <h1 className="px-4 py-2 text-xl">Order details</h1>
                    <button
                        className="ml-auto mr-4 text-textColor1 hover:text-primaryColor"
                        onClick={() => setShowOrderModal(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-grow flex-col overflow-y-auto">
                    <div className="flex min-w-96 flex-col">
                        {/* Items table */}
                        <table className="w-full table-auto overflow-auto text-sm sm:text-lg">
                            <thead className="h-10 text-left">
                                <tr>
                                    <th></th>
                                    <th>Title</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((orderItem) => (
                                    <OrderItem
                                        key={orderItem.id}
                                        orderItem={orderItem}
                                    />
                                ))}
                            </tbody>
                        </table>

                        {/* Order info */}
                        <div className="text:lg flex flex-col px-3 py-2 sm:text-xl">
                            <p>
                                <span className="font-medium">Total:</span> $
                                {selectedOrder?.total_amount.toFixed(2)}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Order Number:
                                </span>{" "}
                                #{selectedOrder?.id}
                            </p>
                            <p>
                                <span className="font-medium">Payment ID:</span>{" "}
                                {selectedOrder?.payment_id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
