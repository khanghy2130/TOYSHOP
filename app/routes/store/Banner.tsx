import { useEffect, useRef, useState } from "react";
import { FetchTriggerType, FilterTag } from "./Types";

import onSaleBanner from "~/assets/promo_banners/on_sale.jpg";
import doubleTagsBanner from "~/assets/promo_banners/double_tags.jpg";
import brandNameBanner from "~/assets/promo_banners/brand_name.jpg";
import { ContextProps } from "~/utils/types/ContextProps.type";
import { useOutletContext } from "@remix-run/react";

type Props = {
    setFetchTrigger: SetState<FetchTriggerType>;
    setSearchQuery: SetState<string>;
    setShowOnSalesOnly: SetState<boolean>;
    setChosenTags: SetState<FilterTag[]>;
    productsContainerRef: React.RefObject<HTMLDivElement>;
};

export default function Banner({
    setFetchTrigger,
    setSearchQuery,
    setShowOnSalesOnly,
    setChosenTags,
    productsContainerRef,
}: Props) {
    const { env } = useOutletContext<ContextProps>();

    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // for when each banner is clicked
    const bannerHandlers: { imgSrc: string; handler: Function }[] = [
        {
            imgSrc: onSaleBanner,
            handler: () => {
                setChosenTags([]);
                setSearchQuery("");
                setShowOnSalesOnly(true);
            },
        },
        {
            imgSrc: doubleTagsBanner,
            handler: () => {
                setSearchQuery("");
                setShowOnSalesOnly(false);
                // example double tags string: bob_1&john_2
                const tagPairs = env.DOUBLE_TAGS_JSON.split("&");
                const tags = tagPairs.map((pair) => {
                    const [name, id] = pair.split("_");
                    return { id: Number(id), name };
                });
                setChosenTags(tags);
            },
        },
        {
            imgSrc: brandNameBanner,
            handler: () => {
                setShowOnSalesOnly(false);
                setChosenTags([]);
                setSearchQuery("yellow");
            },
        },
    ];

    const handleNext = () =>
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerHandlers.length);

    useEffect(() => {
        // scroll to item
        const slider = sliderRef.current;
        if (slider) {
            slider.scrollTo({
                left: slider.offsetWidth * currentIndex,
                behavior: "smooth",
            });
        }

        // set up timer
        const interval = setInterval(() => {
            handleNext();
        }, 4000);

        // clean up timer
        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className="flex w-full flex-col items-center pb-10">
            <div
                ref={sliderRef}
                className="flex aspect-[4] w-11/12 max-w-[600px] snap-x snap-mandatory self-center overflow-x-hidden"
            >
                {bannerHandlers.map(({ imgSrc, handler }, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            handler(); // set search options
                            // scroll to products container
                            productsContainerRef.current?.scrollIntoView({
                                behavior: "smooth",
                            });
                            // trigger fetch
                            setFetchTrigger({ fetchMode: "NEW" });
                        }}
                        className="h-full w-full flex-shrink-0 snap-center"
                    >
                        <img src={imgSrc} className="h-auto w-full" />
                    </button>
                ))}
            </div>
            <div className="flex pt-2">
                {bannerHandlers.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`${i === currentIndex ? "bg-primaryColor" : "bg-textColor2"} mx-1 h-3 w-3 rounded-full hover:bg-textColor1`}
                    ></button>
                ))}
            </div>
        </div>
    );
}
