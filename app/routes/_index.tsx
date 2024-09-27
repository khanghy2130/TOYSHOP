import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
    return [
        { title: "TOYSHOP" },
        { name: "description", content: "Online store for toys." },
    ];
};

export default function Index() {
    return (
        <div>
            <h1 className="text-color-2 text-5xl">Landing page</h1>
        </div>
    );
}
