import { FetchTriggerType } from "./Types";

type Props = {
    setFetchTrigger: SetState<FetchTriggerType>;
    searchQuery: string;
    setSearchQuery: SetState<string>;
    showOnSalesOnly: boolean;
    setShowOnSalesOnly: SetState<boolean>;
};

export default function SearchBar({
    setFetchTrigger,
    searchQuery,
    setSearchQuery,
    showOnSalesOnly,
    setShowOnSalesOnly,
}: Props) {
    function initiateFetching() {
        setFetchTrigger({ fetchMode: "NEW" });
    }

    return (
        <div>
            <div className="flex flex-row align-top">
                <input
                    className="w-3/4 max-w-96 rounded-l-lg bg-bgColor2 px-4 py-2"
                    type="text"
                    placeholder="Search"
                    onKeyDown={(e) => {
                        // hit enter to search
                        if (e.key == "Enter") {
                            e.preventDefault();
                            initiateFetching();
                        }
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />
                <button
                    className="rounded-r-lg bg-primaryColor px-2 text-white hover:bg-primaryColorMuted"
                    type="button"
                    onClick={initiateFetching}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>
                </button>
            </div>

            <div className="py-3">
                <label className="inline-flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        checked={showOnSalesOnly}
                        onChange={() => {
                            setShowOnSalesOnly(!showOnSalesOnly);
                            setFetchTrigger({ fetchMode: "NEW" });
                        }}
                        className="peer sr-only"
                    />
                    <div className="peer relative h-6 w-11 rounded-lg bg-bgColor2 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-lg after:bg-white after:transition-all after:content-[''] peer-checked:bg-primaryColor peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
                    <span className="text-md ms-2 font-medium text-textColor1">
                        On sale
                    </span>
                </label>
            </div>
        </div>
    );
}
