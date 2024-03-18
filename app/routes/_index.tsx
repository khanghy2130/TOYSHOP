import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
    return [
        { title: "New App" },
        { name: "description", content: "Project in progress" },
    ];
};

export default function Index() {
    return (
        <div>
            <h1 className="text-5xl text-color-2">Landing page</h1>
        </div>
    );
}
