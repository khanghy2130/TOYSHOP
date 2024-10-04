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

export const meta: MetaFunction = () => {
    return [
        { title: "TOYSHOP" },
        { name: "description", content: "Online store for toys." },
    ];
};

export default function Index() {
    const highlights: {
        headline: [string, string]; // [outline, fill]
        brief: string;
    }[] = [
        {
            // EXPLORE
            headline: [explore_outline, explore_fill],
            brief: "exploreeee",
        },
        {
            // COLLECT
            headline: [collect_outline, collect_fill],
            brief: "colllecettt",
        },
        {
            // SAVE
            headline: [save_outline, save_fill],
            brief: "sassavavee",
        },
        {
            // SHARE
            headline: [share_outline, share_fill],
            brief: "shharrree",
        },
    ];

    return (
        <div className="relative h-full w-full">
            <ThreeCanvas />
            {/* Hero section */}
            <div className="relative z-10 h-96 w-full bg-bgColor2">
                <h1>Welcome</h1>
            </div>
            {highlights.map((highlight, i) => (
                <div key={i} className="h-screen">
                    <div className="sticky top-0 -z-10 flex justify-center pt-16">
                        <div className="relative flex justify-start">
                            <img
                                className="w-screen max-w-[800px]"
                                src={highlight.headline[0]}
                            />
                            <div className="absolute left-0 top-0 w-[50%] overflow-x-hidden bg-bgColor2">
                                <img
                                    className="w-screen max-w-[800px]"
                                    src={highlight.headline[1]}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="relative z-10">
                        {highlight.brief} Online store for toys. Online store
                        for toys. Online store for toys. Online store for toys.
                    </p>
                </div>
            ))}
        </div>
    );
}
