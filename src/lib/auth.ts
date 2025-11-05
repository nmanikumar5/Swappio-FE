export function getClientToken(): string | null {
    try {
        // Primary source: localStorage
        const t = localStorage.getItem('swappio_token');
        if (t) return t;
    } catch { }

    try {
        // Fallback: cookie set by auth flow (client copy)
        const m = document.cookie.match(/(?:^|; )swappio_token_client=([^;]+)/);
        if (m) return decodeURIComponent(m[1]);
    } catch { }

    return null;
}

export function getAuthHeader(): Record<string, string> | undefined {
    const token = getClientToken();
    if (token) return { Authorization: `Bearer ${token}` };
    return undefined;
}
