export type CartItemType = {
    id: number;
    quantity: number;
    product: {
        id: number;
        title: string;
        price_with_discount: number | null;
        quantity: number;
    } | null;
};
