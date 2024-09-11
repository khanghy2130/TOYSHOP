import { PopupNotification } from "~/utils/types/ContextProps.type";

type Props = {
    notifications: PopupNotification[];
};

export default function PopupNotificationsList({ notifications }: Props) {
    return (
        <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-start">
            {notifications.map((notif) => (
                <div key={notif.id} className="bg-bgColor2">
                    <p className="text-textColor1">{notif.message}</p>
                </div>
            ))}
        </div>
    );
}
