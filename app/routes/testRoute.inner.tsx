import { useOutletContext } from "@remix-run/react";

export default function testRouteInner() {
    const { parentState } = useOutletContext<{ parentState: boolean }>();

    if (!parentState) return;

    return <div> Test Router Inner </div>;
}
