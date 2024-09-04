import { ProductInfo } from "./Types";

type Props = { productInfo: ProductInfo };

export default function Tags({ productInfo }: Props) {
    return (
        <div>
            {productInfo.tags.map((tag) => (
                <div className="flex" key={tag}>
                    <p className="rounded-lg border-2 border-solid border-color-2 p-1">
                        {tag}
                    </p>
                </div>
            ))}
        </div>
    );
}
