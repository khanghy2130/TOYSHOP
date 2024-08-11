export default function StorePage() {
    return (
        <div>
            {Array.apply(null, Array(100)).map((x, i) => (
                <p key={i}>{i}</p>
            ))}
        </div>
    );
}
