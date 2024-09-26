import { useCallback, useState } from "react";
import { PopupNotification } from "~/utils/types/ContextProps.type";

export type AddNotificationFunction = (
    message: string,
    type: PopupNotification["type"],
) => void;
export function useNotification(): [
    PopupNotification[],
    AddNotificationFunction,
] {
    const [notifications, setNotifications] = useState<PopupNotification[]>([]);
    const addNotification = useCallback(
        (message: string, type: PopupNotification["type"]) => {
            const id: number = Date.now() + Math.floor(Math.random() * 10000);
            setNotifications((prev) => [...prev, { id, message, type }]);

            setTimeout(() => {
                setNotifications((prev) =>
                    prev.filter((notification) => notification.id !== id),
                );
            }, 4000); // remove after 4 seconds
        },
        [],
    );
    return [notifications, addNotification];
}
