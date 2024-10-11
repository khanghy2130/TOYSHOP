import type { MetaFunction } from "@remix-run/node";
import ThreeCanvas from "./ThreeCanvas";

import heroBgImage from "~/assets/landing_page/hero-section-background.webp";

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
import { Link } from "@remix-run/react";
import { useEffect, useRef } from "react";

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

    const heroSectionRef = useRef<HTMLDivElement>(null);
    // move hero section on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!heroSectionRef.current) return;
            heroSectionRef.current.style.transform = `translateY(-${window.scrollY * 0.14}vh)`;
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="relative h-full w-full">
            <ThreeCanvas />

            {/* Hero section */}
            <div
                ref={heroSectionRef}
                style={{
                    backgroundImage: `url(${heroBgImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="relative z-30 -mt-24 flex h-[85vh] w-full flex-col items-center justify-center overflow-hidden"
            >
                <h1 className="custom-text-shadow mx-2 mb-24 max-w-[700px] text-center text-3xl font-bold leading-tight text-white sm:mx-5 sm:text-5xl sm:leading-tight">
                    Discover your next favorite toys here at TOYSHOP.
                </h1>
                <Link to="/store" className="relative">
                    <button className="click-shrink custom-box-shadow rounded-lg bg-primaryColor px-5 py-3 text-xl font-bold text-primaryTextColor hover:bg-primaryColorMuted sm:text-2xl">
                        Shop now
                    </button>
                </Link>
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
