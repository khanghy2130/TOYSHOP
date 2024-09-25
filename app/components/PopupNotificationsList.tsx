import { PopupNotification } from "~/utils/types/ContextProps.type";

type Props = {
    notifications: PopupNotification[];
};

export default function PopupNotificationsList({ notifications }: Props) {
    const dummy = "FAIL";

    return (
        <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end px-4 py-4">
            {notifications.map((notif) => (
                <div key={notif.id} className="my-1 flex flex-col bg-bgColor2">
                    <div className="flex max-w-96 items-center px-3 py-2 text-lg text-textColor1">
                        {popupIcon(notif.type)}
                        <span className="ms-2">{notif.message}</span>
                    </div>
                    <div
                        className={`${popupColor(notif.type)} animate-shrink-width h-1`}
                    ></div>
                </div>
            ))}
        </div>
    );
}

const popupColor = function (type: PopupNotification["type"]) {
    if (type === "SUCCESS") return "bg-green-500";
    if (type === "FAIL") return "bg-red-500";
    return "";
};

const popupIcon = function (type: PopupNotification["type"]) {
    if (type === "SUCCESS")
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7 text-green-500"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>
        );

    if (type === "FAIL")
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7 text-red-500"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
            </svg>
        );

    return null;
};
