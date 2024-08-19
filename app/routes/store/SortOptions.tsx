import { FetchTriggerType, SortType } from "./Types";

type Props = {
    setFetchTrigger: SetState<FetchTriggerType>;
    chosenSort: SortType;
    setChosenSort: SetState<SortType>;
    sortDescending: boolean;
    setSortDescending: SetState<boolean>;
};

export default function SortOptions({
    setFetchTrigger,
    chosenSort,
    setChosenSort,
    sortDescending,
    setSortDescending,
}: Props) {
    function sortOptionButton(displayText: string, type: SortType) {
        if (chosenSort === type) {
            // selected sort type render
            return (
                <button
                    className="btn"
                    onClick={() => {
                        setSortDescending(!sortDescending);
                        setFetchTrigger({ fetchMode: "NEW" });
                    }}
                >
                    {displayText + (sortDescending ? "(D)" : "(A)")}
                </button>
            );
        } else {
            return (
                <button
                    className="btn"
                    onClick={() => {
                        setChosenSort(type);
                        setFetchTrigger({ fetchMode: "NEW" });
                    }}
                >
                    {displayText}
                </button>
            );
        }
    }

    return (
        <div className="flex">
            {sortOptionButton("Title", "TITLE")}
            {sortOptionButton("Price", "PRICE")}
            {sortOptionButton("Rating", "RATING")}
        </div>
    );
}
