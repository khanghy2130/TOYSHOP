import { ProductInfo } from "./Types";

type Props = { productInfo: ProductInfo; SUPABASE_IMAGES_PATH: string };

export default function Gallery({ productInfo, SUPABASE_IMAGES_PATH }: Props) {
    return (
        <div>
            {productInfo.imgNames.map((imgName, i) => (
                <div className="flex" key={i}>
                    <img
                        className="w-80"
                        src={`${SUPABASE_IMAGES_PATH}/${productInfo.id}/${imgName}`}
                    />
                </div>
            ))}
        </div>
    );
}
