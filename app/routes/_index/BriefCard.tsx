import { useInView } from "react-intersection-observer";
import { HighlightInfo } from ".";

type Props = {
    highlight: HighlightInfo;
};

export default function BriefCard({ highlight }: Props) {
    const { ref: briefRef, inView: briefInView } = useInView({
        threshold: 0.5, // How much visible to trigger
        triggerOnce: true,
    });

    return (
        <div ref={briefRef} className="flex w-full p-1 sm:w-1/2 sm:p-2">
            <div className="flex flex-col px-0 py-4 sm:px-4">
                <h1 className="-mb-2 ms-4 text-4xl font-bold text-primaryColor sm:text-5xl">
                    {highlight.headline}
                </h1>
                <p className="w-full flex-grow rounded-lg bg-primaryColor px-2 py-4 text-2xl text-primaryTextColor shadow-md sm:rounded-xl sm:text-3xl">
                    {highlight.brief.split(" ").map((word, index) => (
                        <span
                            key={index}
                            className={`${briefInView ? "opacity-100" : "opacity-0"} inline-block transition-opacity duration-500`}
                            style={{
                                transitionDelay: `${index * 0.1}s`,
                            }}
                        >
                            &nbsp;{word}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
}
