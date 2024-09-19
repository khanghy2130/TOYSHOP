export default function Footer() {
    return (
        <div className="flex w-full flex-grow items-end pt-10">
            <div className="text-md flex w-full flex-col items-center bg-black px-2 py-3 text-center text-gray-200 sm:px-20 sm:text-lg">
                <h2>&copy; {new Date().getFullYear()} Hy Nguyen</h2>
                <h2>
                    <span className="font-bold">Disclaimer:</span> This is a
                    demo website project, not a real online store!
                </h2>
            </div>
        </div>
    );
}
