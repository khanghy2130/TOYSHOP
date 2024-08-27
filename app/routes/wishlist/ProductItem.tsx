import { Tables } from "database.types";

type Props = {
    product: Tables<"PRODUCTS">;
};

export default function ProductItem({ product }: Props) {
    return <div>title: {product.title}</div>;
}
