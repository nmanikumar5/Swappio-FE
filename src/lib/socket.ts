import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let reconnectTimer: number | null = null;
let backoffMs = 500; // start 500ms
const MAX_BACKOFF = 30_000; // cap at 30s

function clearReconnect() {
    try {
        if (reconnectTimer) {
            clearTimeout(reconnectTimer as unknown as number);
            reconnectTimer = null;
        }
    } catch { }
}

function scheduleReconnect() {
    clearReconnect();
    const delay = backoffMs;
    console.log('[SOCKET] scheduling reconnect in', delay, 'ms');
    reconnectTimer = window.setTimeout(() => {
        // exponential backoff
        backoffMs = Math.min(MAX_BACKOFF, Math.floor(backoffMs * 1.8));
        try {
            // attempt to re-initialize socket
            const s = createSocket();
            if (s) {
                // reset backoff on successful connect
                s.on('connect', () => {
                    backoffMs = 500;
                    clearReconnect();
                });
                // if connect fails, schedule another attempt
                s.on('connect_error', () => scheduleReconnect());
            } else {
                // no token — try again later
                scheduleReconnect();
            }
        } catch (e) {
            scheduleReconnect();
        }
    }, delay);
}

function createSocket(): Socket | null {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('swappio_token') : null;
        if (!token) {
            console.log('[SOCKET] no token found; skipping socket initialization');
            return null;
        }
        const url = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001');
        console.log('[SOCKET] connecting to', url, 'token present?', !!token);
        const s = io(url, {
            auth: { token },
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        // attach basic handlers to trigger reconnect scheduling
        s.on('disconnect', (reason) => {
            console.warn('[SOCKET] disconnected:', reason);
            scheduleReconnect();
        });
        s.on('connect', () => {
            try {
                console.log('[SOCKET] created socket connected id=', s.id, 'connected=', s.connected);
            } catch { }
        });
        s.on('connect_error', (err) => {
            console.error('[SOCKET] connect_error', err);
            scheduleReconnect();
        });

        return s;
    } catch {
        return null;
    }
}

export function getSocket() {
    if (socket) return socket;
    socket = createSocket();
    return socket;
}

export function closeSocket() {
    try {
        clearReconnect();
        if (socket) {
            socket.off();
            socket.close();
            socket = null;
        }
    } catch { }
}
