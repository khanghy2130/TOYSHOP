import type { MetaFunction } from "@remix-run/node";
import ThreeCanvas from "./ThreeCanvas";

export const meta: MetaFunction = () => {
    return [
        { title: "TOYSHOP" },
        { name: "description", content: "Online store for toys." },
    ];
};

export default function Index() {
    return (
        <div className="relative h-full w-full">
            <ThreeCanvas />
            {Array.from(Array(200)).map((item, i) => (
                <p key={i}>{i}</p>
            ))}
        </div>
    );
}
