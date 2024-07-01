type Props = {
    setEnableAvatarCustomization: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AvatarCustomization({
    setEnableAvatarCustomization,
}: Props) {
    const saveAvatar: React.DOMAttributes<HTMLButtonElement>["onClick"] =
        async function (event) {
            console.log("save avatar clicked");
        };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="h-96 w-11/12 max-w-[800px] bg-color-1">
                <h1>Avatar customization</h1>

                <img
                    className="h-40 w-40"
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                />

                <button
                    className="btn"
                    onClick={() => setEnableAvatarCustomization(false)}
                >
                    Cancel
                </button>
                <button className="btn" onClick={saveAvatar}>
                    Save
                </button>
            </div>
        </div>
    );
}
