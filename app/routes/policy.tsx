import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [{ title: "Policy" }];
};

export default function PolicyPage() {
    return (
        <div className="mt-10 max-w-[600px] text-xl">
            <h1 className="mb-6 text-center text-3xl">Policy</h1>
            <p className="mb-4">
                This website is a portfolio project created to showcase a
                fictional online store. Please note that the store is not
                operational, and no real transactions occur here.
            </p>
            <p className="mb-4">
                If you link your Google account, only name and email will be
                collected to create your profile for demo purposes. You may
                request to have your data deleted at any time.
            </p>
            <p>
                Contact{" "}
                <a href="mailto:hynguyendev@gmail.com" className="underline">
                    hynguyendev@gmail.com
                </a>
            </p>
        </div>
    );
}
