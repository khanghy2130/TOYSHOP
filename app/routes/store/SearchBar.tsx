type Props = {
    setFetchTrigger: SetState<{}>;
    seachQuery: string;
    setSeachQuery: SetState<string>;
    showOnSalesOnly: boolean;
    setShowOnSalesOnly: SetState<boolean>;
};

export default function TagsFilter({
    setFetchTrigger,
    seachQuery,
    setSeachQuery,
    showOnSalesOnly,
    setShowOnSalesOnly,
}: Props) {
    function initiateFetching() {
        setFetchTrigger({});
    }

    return (
        <div>
            <div>
                <input
                    className="bg-color-3 p-2"
                    type="text"
                    placeholder="Search"
                    onKeyDown={(e) => {
                        // hit enter to search
                        if (e.key == "Enter") {
                            e.preventDefault();
                            initiateFetching();
                        }
                    }}
                    value={seachQuery}
                    onChange={(e) => setSeachQuery(e.currentTarget.value)}
                />
                <button
                    className="btn"
                    type="button"
                    onClick={initiateFetching}
                >
                    Search
                </button>
            </div>

            <div>
                <label className="inline-flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        checked={showOnSalesOnly}
                        onChange={() => setShowOnSalesOnly(!showOnSalesOnly)}
                        className="peer sr-only"
                    />
                    <div
                        className="peer relative h-6 w-11 rounded-full bg-color-3
                        after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full 
                        after:bg-color-2 after:transition-all after:content-[''] peer-checked:bg-color-4
                        peer-checked:after:translate-x-full
                        rtl:peer-checked:after:-translate-x-full"
                    ></div>
                    <span className="ms-3 text-sm font-medium text-color-2">
                        On sale only
                    </span>
                </label>
            </div>
        </div>
    );
}
