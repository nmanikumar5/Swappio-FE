// Simulate FE fetchWithAuth behavior to verify refresh updates local storage
const http = require('http');
const https = require('https');
const urlLib = require('url');

async function httpRequest(url, opts = {}) {
    return new Promise((resolve, reject) => {
        const parsed = urlLib.parse(url);
        const lib = parsed.protocol === 'https:' ? https : http;
        const headers = opts.headers || {};
        const method = opts.method || 'GET';
        const body = opts.body || null;

        const req = lib.request({ hostname: parsed.hostname, port: parsed.port, path: parsed.path, method, headers }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk.toString());
            res.on('end', () => {
                res.body = data;
                resolve(res);
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}
// lightweight in-memory localStorage shim for this script
const localStorage = (function () {
    const store = new Map();
    return {
        getItem(key) { return store.has(key) ? store.get(key) : null; },
        setItem(key, val) { store.set(key, String(val)); },
        removeItem(key) { store.delete(key); },
    };
})();
const API = process.env.API_URL || 'http://localhost:5001/api';
let cookieJar = [];

async function authHeaders() {
    const headers = {};
    try {
        const token = localStorage.getItem('swappio_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;
    } catch { }
    return headers;
}

async function fetchWithAuth(input, init, retry = true) {
    // baseInit equivalent: include headers and cookie from jar
    const baseHeaders = (init && init.headers) ? { ...(init.headers) } : {};
    if (cookieJar.length) baseHeaders['Cookie'] = cookieJar.join('; ');
    const res = await httpRequest(input, { method: (init && init.method) || 'GET', headers: baseHeaders, body: init && init.body });
    if ((res.statusCode === 401 || res.statusCode === 403) && retry) {
        try {
            // call refresh with cookie jar
            const r = await httpRequest(`${API}/auth/refresh`, { method: 'POST', headers: { Cookie: cookieJar.join('; ') } });
            // capture any new Set-Cookie headers
            const setCookies = r.headers && r.headers['set-cookie'];
            if (setCookies && Array.isArray(setCookies)) {
                // replace cookieJar entries for swappio_refresh/swappio_token
                setCookies.forEach((c) => {
                    const key = c.split('=')[0];
                    // remove existing cookie with same key
                    cookieJar = cookieJar.filter((cc) => !cc.startsWith(key + '='));
                    cookieJar.push(c.split(';')[0]);
                });
            }
            if (r.statusCode >= 200 && r.statusCode < 300) {
                let body = null;
                try { body = JSON.parse(r.body || '{}'); } catch { }
                const token = body?.data?.token;
                if (token) localStorage.setItem('swappio_token', token);

                // retry original request with updated Authorization and cookies
                const newHeaders = { ...(baseHeaders || {}) };
                try {
                    const token2 = localStorage.getItem('swappio_token');
                    if (token2) newHeaders['Authorization'] = `Bearer ${token2}`;
                } catch { }
                if (cookieJar.length) newHeaders['Cookie'] = cookieJar.join('; ');
                const retryRes = await httpRequest(input, { method: (init && init.method) || 'GET', headers: newHeaders, body: init && init.body });
                return retryRes;
            }
        } catch (err) {
            // ignore
        }
    }
    return res;
}

(async () => {
    try {
        // login to get initial token and cookies
        const email = 'socket-test@example.com';
        const password = 'password123';
        const loginRes = await httpRequest(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const loginBody = JSON.parse(loginRes.body || '{}');
        // capture cookies from login response
        if (loginRes.headers && loginRes.headers['set-cookie']) {
            cookieJar = Array.isArray(loginRes.headers['set-cookie']) ? loginRes.headers['set-cookie'].map(c => c.split(';')[0]) : [loginRes.headers['set-cookie'].split(';')[0]];
        }
        const token = loginBody?.data?.token;
        console.log('Initial token (trunc):', token?.slice(0, 20) + '...');
        localStorage.setItem('swappio_token', token);

        // simulate expiry by removing token
        localStorage.removeItem('swappio_token');
        console.log('Token removed from localStorage to simulate expiry.');

        // now call a protected endpoint (messages/unread/count) which should trigger refresh
        const res = await fetchWithAuth(`${API}/messages/unread/count`, { headers: await authHeaders() });
        console.log('Protected call status after fetchWithAuth:', res.statusCode || res.status);
        const bodyText = res.body || '';
        let body = null;
        try { body = JSON.parse(bodyText); } catch { }
        console.log('Response body:', body);
        console.log('LocalStorage token after refresh attempt:', localStorage.getItem('swappio_token')?.slice(0, 20) + '...');
    } catch (err) {
        console.error('Sim failed', err);
        process.exit(1);
    }
})();
