export type CartItem = {
    id: number;
    quantity: number;
    product: {
        id: number;
        title: string;
        price: number;
        discount: number;
        quantity: number;
    };
};
