export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
    if (Notification.permission === 'granted') return 'granted';
    return await Notification.requestPermission();
}

export function showBrowserNotification(title: string, options?: NotificationOptions) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    try {
        const n = new Notification(title, options);
        return n;
    } catch (e) {
        // silently ignore
        console.warn('Browser notification failed', e);
    }
}

export function showBrowserNotificationWithClick(title: string, options: NotificationOptions | undefined, onClick?: () => void) {
    const n = showBrowserNotification(title, options) as any;
    if (!n) return;
    try {
        n.onclick = () => {
            try { window.focus(); } catch { }
            if (typeof onClick === 'function') onClick();
        };
    } catch (e) {
        console.warn('Failed to attach click handler to notification', e);
    }
}
