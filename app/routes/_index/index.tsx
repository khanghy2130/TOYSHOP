import type { MetaFunction } from "@remix-run/node";
import ThreeCanvas from "./ThreeCanvas";

import explore_outline from "~/assets/landing_page/headlines/explore_outline.png";
import explore_fill from "~/assets/landing_page/headlines/explore_fill.png";
import collect_outline from "~/assets/landing_page/headlines/collect_outline.png";
import collect_fill from "~/assets/landing_page/headlines/collect_fill.png";
import save_outline from "~/assets/landing_page/headlines/save_outline.png";
import save_fill from "~/assets/landing_page/headlines/save_fill.png";
import share_outline from "~/assets/landing_page/headlines/share_outline.png";
import share_fill from "~/assets/landing_page/headlines/share_fill.png";
import Headlines from "./Headlines";
import BriefCard from "./BriefCard";

export const meta: MetaFunction = () => {
    return [
        { title: "TOYSHOP" },
        { name: "description", content: "Online store for toys." },
    ];
};

export type HighlightInfo = {
    headline: string;
    headlineImages: [string, string]; // [outline, fill]
    brief: string;
};

export default function LandingPage() {
    const highlights: HighlightInfo[] = [
        {
            headline: "Explore",
            headlineImages: [explore_outline, explore_fill],
            brief: "Browse our huge selection of unique and exciting toys, from futuristic vehicles to powerful battle machines, all waiting to be explored.",
        },
        {
            headline: "Collect",
            headlineImages: [collect_outline, collect_fill],
            brief: "Build your ultimate collection with limited editions and series designed for true enthusiasts and collectors alike.",
        },
        {
            headline: "Save",
            headlineImages: [save_outline, save_fill],
            brief: "Save big on every purchase! We offer unbeatable deals and exclusive discounts. Don't miss our regular flash sales for your favorite toys!",
        },
        {
            headline: "Share",
            headlineImages: [share_outline, share_fill],
            brief: "Join the conversation! Share your experience, rate your favorites, and help others find the perfect toy by leaving your feedback and reviews.",
        },
    ];

    return (
        <div className="relative h-full w-full">
            <ThreeCanvas />
            {/* Hero section */}
            <div className="relative z-10 mb-20 h-96 w-full bg-bgColor2">
                <h1>Welcome</h1>
            </div>

            {/* Headlines scrollzone */}
            {highlights.map((highlight, i) => (
                <Headlines key={i} highlight={highlight} />
            ))}

            {/* Highlight briefs */}
            <div className="relative z-10 -mb-10 py-40 backdrop-blur-md">
                <div className="mx-auto flex w-full max-w-[400px] flex-wrap px-2 sm:max-w-[800px]">
                    {highlights.map((highlight, i) => (
                        <BriefCard key={i} highlight={highlight} />
                    ))}
                </div>
            </div>
        </div>
    );
}
