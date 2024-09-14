import { useEffect, useRef, useState } from "react";
import { ProductInfo } from "./Types";

type Props = { productInfo: ProductInfo; SUPABASE_IMAGES_PATH: string };

export default function Gallery({ productInfo, SUPABASE_IMAGES_PATH }: Props) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    const selectedImageRef = useRef<HTMLImageElement>(null);

    // change image animation
    useEffect(() => {
        if (!selectedImageRef.current) return;

        selectedImageRef.current.classList.remove("scale-100");
        selectedImageRef.current.classList.add("scale-95");
        const timer = setTimeout(() => {
            if (!selectedImageRef.current) return;
            selectedImageRef.current.classList.remove("scale-95");
            selectedImageRef.current.classList.add("scale-100");
        }, 100);

        return () => clearTimeout(timer);
    }, [selectedImageIndex]);

    return (
        <div className="flex flex-grow flex-col duration-100 lg:sticky lg:top-0 lg:flex-row-reverse lg:items-start">
            {/* selected image */}
            <div className="flex flex-grow justify-center p-1">
                <img
                    ref={selectedImageRef}
                    className="w-full max-w-[420px] transition-transform lg:max-w-[600px]"
                    src={`${SUPABASE_IMAGES_PATH}/${productInfo.id}/${productInfo.imgNames[selectedImageIndex]}`}
                />
            </div>
            {/* images list */}
            <div className="flex overflow-x-auto lg:w-32 lg:flex-col">
                {productInfo.imgNames.map((imgName, i) => (
                    <button
                        key={imgName}
                        className="click-shrink p-2"
                        onClick={() => setSelectedImageIndex(i)}
                    >
                        <img
                            className={`${selectedImageIndex === i ? "" : "opacity-50"} h-auto min-w-24 lg:w-full`}
                            src={`${SUPABASE_IMAGES_PATH}/${productInfo.id}/${imgName}`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
