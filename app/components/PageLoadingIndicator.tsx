import { useNavigation } from "@remix-run/react";
import SpinnerSVG from "./SpinnerSVG";

export default function PageLoadingIndicator() {
    const navigation = useNavigation();
    if (navigation.state !== "loading") return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="h-20 w-20 text-primaryColor">
                <SpinnerSVG />
            </div>
        </div>
    );
}
