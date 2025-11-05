import { User } from '@/types';
import { fetchWithAuth } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function register(payload: { name: string; email: string; password: string; }) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload }),
    });
    if (!res.ok) throw new Error('Registration failed');
    const body = await res.json();
    // persist token and user to localStorage for subsequent API calls
    try {
        persistAuth(body.data.user as User, body.data.token as string);
    } catch { }
    return body.data as { user: User; token: string };
}

export async function login(payload: { email: string; password: string; }) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Login failed');
    }
    const body = await res.json();
    // persist token and user to localStorage for subsequent API calls
    try {
        persistAuth(body.data.user as User, body.data.token as string);
    } catch { }
    return body.data as { user: User; token: string };
}

export async function googleLogin(token: string) {
    const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        credentials: 'include',
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Google login failed');
    }
    const body = await res.json();
    // persist token and user to localStorage for subsequent API calls
    try {
        persistAuth(body.data.user as User, body.data.token as string);
    } catch { }
    return body.data as { user: User; token: string };
}

export async function sendPhoneVerificationCode(phone: string) {
    const res = await fetch(`${API_URL}/auth/phone/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
        credentials: 'include',
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Failed to send verification code');
    }
    const body = await res.json();
    return body.data as { phone: string; expiresIn: number };
}

export async function verifyPhoneCode(phone: string, code: string, name?: string) {
    const res = await fetch(`${API_URL}/auth/phone/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, name }),
        credentials: 'include',
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Verification failed');
    }
    const body = await res.json();
    // persist token and user to localStorage
    try {
        persistAuth(body.data.user as User, body.data.token as string);
    } catch { }
    return body.data as { user: User; token: string };
}

export async function fetchProfile() {
    const token = (() => { try { return localStorage.getItem('swappio_token'); } catch { return null; } })();

    // ONLY authenticate if we have a localStorage token
    // Do NOT use cookies for auto-login to prevent logout issues
    if (!token) {
        throw new Error('No token found');
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Simple fetch without cookie-based fallback
    const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers,
        credentials: 'include'
    });

    if (!res.ok) {
        // Clear invalid token
        clearSwappioStorage();
        throw new Error('Not authenticated');
    }

    const body = await res.json();
    // Update persisted user
    try {
        persistAuth(body.data.user as User, token);
    } catch { }
    return body.data.user as User;
}

export async function logoutRequest() {
    // Call backend to clear httpOnly cookies
    try {
        const token = localStorage.getItem('swappio_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers
        });
    } catch (error) {
        console.error('Backend logout error:', error);
    }

    // Clear all local storage - this is the key to preventing auto-login
    try {
        clearSwappioStorage();
        persistAuth(null);
    } catch { }
}

export function persistAuth(user: User | null, token?: string | null) {
    // If a user object is provided, persist the user. Only update the token if a
    // non-null token is provided. Previously the function required both user and
    // token which caused calls like persistAuth(user, null) to clear storage —
    // this led to profile fetches wiping localStorage unintentionally.
    try {
        if (user) {
            localStorage.setItem('swappio_user', JSON.stringify(user));
            if (token) {
                localStorage.setItem('swappio_token', token);
            }
            return;
        }

        // When user is null, clear swappio-related keys.
        Object.keys(localStorage).forEach((k) => {
            if (k && (k === 'swappio_user' || k === 'swappio_token' || k.startsWith('swappio') || k.startsWith('swappio:'))) {
                localStorage.removeItem(k);
            }
        });
    } catch {
        // ignore storage errors
    }
}

export function getPersistedAuth() {
    try {
        const u = localStorage.getItem('swappio_user');
        const t = localStorage.getItem('swappio_token');
        if (u && t) return { user: JSON.parse(u) as User, token: t };
    } catch {
        // ignore
    }
    return null;
}

export function clearSwappioStorage() {
    try {
        Object.keys(localStorage).forEach((k) => {
            if (k && (k === 'swappio_user' || k === 'swappio_token' || k.startsWith('swappio') || k.startsWith('swappio:'))) {
                localStorage.removeItem(k);
            }
        });
    } catch {
        // ignore
    }
}

export async function updateProfile(payload: { name: string; phone?: string; location?: string; photo?: string; }) {
    const token = (() => { try { return localStorage.getItem('swappio_token'); } catch { return null; } })();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetchWithAuth(`${API_URL}/auth/profile`, { method: 'PUT', headers, body: JSON.stringify(payload), credentials: 'include' });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Update profile failed');
    }
    const body = await res.json();
    // update persisted user locally
    try {
        const token2 = localStorage.getItem('swappio_token');
        if (token2) persistAuth(body.data.user as User, token2);
    } catch { }
    return body.data.user as User;
}
