
type Props = {
    size: number;
};

export default function SidePanel({size} : Props){
    return <svg className={`h-${size} w-${size}`} viewBox="0 0 24 24">
        <rect width="6" height="14" x="1" y="4" fill="currentColor">
            <animate id="svgSpinnersBarsScaleFade0" fill="freeze" attributeName="y" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s" values="1;5"/>
            <animate fill="freeze" attributeName="height" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s" values="22;14"/>
            <animate fill="freeze" attributeName="opacity" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s" values="1;.2"/>
        </rect>
        <rect width="6" height="14" x="9" y="4" fill="currentColor" opacity=".4">
            <animate fill="freeze" attributeName="y" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s" values="1;5"/>
            <animate fill="freeze" attributeName="height" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s" values="22;14"/>
            <animate fill="freeze" attributeName="opacity" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s" values="1;.2"/>
        </rect>
        <rect width="6" height="14" x="17" y="4" fill="currentColor" opacity=".3">
            <animate id="svgSpinnersBarsScaleFade1" fill="freeze" attributeName="y" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s" values="1;5"/>
            <animate fill="freeze" attributeName="height" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s" values="22;14"/>
            <animate fill="freeze" attributeName="opacity" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s" values="1;.2"/>
        </rect>
    </svg>;
}