import { Outlet } from "@remix-run/react";
import { useState } from "react";

export default function testRoute() {
    const [parentState, setParentState] = useState<boolean>(false);

    return (
        <div>
            Test Route
            <button
                onClick={() => {
                    setParentState(!parentState);
                }}
            >
                {" "}
                Click here{" "}
            </button>
            <Outlet context={{ parentState }} />
        </div>
    );
}
