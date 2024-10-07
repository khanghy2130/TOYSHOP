import { HighlightInfo } from ".";
import { useEffect, useRef, useState } from "react";

type Props = {
    highlight: HighlightInfo;
};

export default function Headlines({ highlight }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [headlineWidth, setHeadlineWidth] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const clientRect = containerRef.current.getBoundingClientRect();
            const percentage =
                (100 / clientRect.height) *
                (clientRect.height - clientRect.bottom);
            // add 5% to fill up sooner
            setHeadlineWidth(Math.min(Math.max(percentage + 5, 0), 100));
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div ref={containerRef} className="flex h-[1000px] flex-col">
            {/* Headline image */}
            <div className="sticky top-0 -z-10 flex justify-center">
                <div className="relative flex justify-start">
                    <img
                        className="w-screen max-w-[800px]"
                        src={highlight.headlineImages[0]}
                    />
                    <div
                        className="absolute left-0 top-0 overflow-x-hidden"
                        style={{
                            width: headlineWidth + "%",
                        }}
                    >
                        <img
                            className="w-screen max-w-[800px]"
                            src={highlight.headlineImages[1]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
