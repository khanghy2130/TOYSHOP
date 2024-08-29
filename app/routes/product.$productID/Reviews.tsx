import { ProductInfo } from "./Types";

type Props = { productInfo: ProductInfo };

export default function Reviews({ productInfo }: Props) {
    return <div>All reviews. Sort (recent or top rating)</div>;
}
