import { CreatePaymentInfoReturnType } from "~/utils/payment";

type Props = {
    shortCartItems: CreatePaymentInfoReturnType["shortCartItems"];
    paymentIntent: CreatePaymentInfoReturnType["paymentIntent"];
};

export default function OrderDetails({ shortCartItems, paymentIntent }: Props) {
    return (
        <div className="mb-3 w-full">
            <table className="w-full table-auto overflow-auto text-base sm:text-lg">
                <thead className="h-10 text-left">
                    <tr>
                        <th>Title</th>
                        <th className="px-1">Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {shortCartItems.map((sci) => (
                        <tr
                            key={sci.id}
                            className="odd:bg-white odd:bg-opacity-25 dark:odd:bg-black dark:odd:bg-opacity-15"
                        >
                            <td>{sci.title}</td>

                            <td>{sci.quantity}</td>
                            <td className="font-medium">
                                ${sci.subtotal.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="py-2 text-right text-lg font-medium">
                Total: ${(paymentIntent.amount / 100).toFixed(2)}
            </p>
        </div>
    );
}
