import { Link } from "@remix-run/react";

export default function Footer() {
    return (
        <div className="z-10 flex w-full flex-grow items-end pt-10">
            <div className="flex w-full flex-col items-stretch bg-black px-4 py-3 text-center text-sm text-gray-200 sm:px-20 sm:text-lg">
                <h2>&copy; {new Date().getFullYear()} TOYSHOP</h2>
                <h2 className="px-2">
                    <span className="font-bold">Disclaimer:</span> This is a
                    demo website project, not a real online store!
                </h2>
                <Link
                    to="/policy"
                    className="font-medium underline hover:text-primaryColor"
                >
                    See policy
                </Link>
            </div>
        </div>
    );
}
