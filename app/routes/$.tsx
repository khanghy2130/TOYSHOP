// 404 route
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [{ title: "404 Not found" }];
};

export default function SplatRoute() {
    return (
        <div className="mt-10">
            <h1 className="text-2xl">Page not found.</h1>
        </div>
    );
}
