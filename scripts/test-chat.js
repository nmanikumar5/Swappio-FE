#!/usr/bin/env node
// Quick test script to login and fetch conversations/messages
// Usage:
// BACKEND_URL=http://localhost:5001 EMAIL=you@example.com PASSWORD=secret node scripts/test-chat.js

const BACKEND = process.env.BACKEND_URL || 'http://localhost:5001';
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

async function run() {
    if (!EMAIL || !PASSWORD) {
        console.log('Usage: BACKEND_URL=http://localhost:5001 EMAIL=you@example.com PASSWORD=secret node scripts/test-chat.js');
        process.exit(1);
    }

    try {
        console.log('Logging in...');
        const loginRes = await fetch(`${BACKEND}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
            credentials: 'include',
        });

        const loginBody = await loginRes.json().catch(() => null);
        if (!loginRes.ok) {
            console.error('Login failed', loginRes.status, loginBody);
            process.exit(2);
        }

        const token = loginBody?.data?.token || loginBody?.token;
        if (!token) {
            console.error('No token returned from login');
            console.log('Response body:', loginBody);
            process.exit(3);
        }

        console.log('Token received. Fetching conversations...');
        const convRes = await fetch(`${BACKEND}/api/messages/conversations`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const convBody = await convRes.json().catch(() => null);
        if (!convRes.ok) {
            console.error('Failed to fetch conversations', convRes.status, convBody);
            process.exit(4);
        }

        const convs = convBody?.data?.conversations || [];
        console.log(`Found ${convs.length} conversations`);
        if (convs.length === 0) process.exit(0);

        // pick the first conv and determine the other user id
        const first = convs[0];
        const meId = loginBody?.data?.user?.id || loginBody?.user?.id;
        const senderId = String(first.sender?._id || first.sender?.id);
        const receiverId = String(first.receiver?._id || first.receiver?.id);
        const other = senderId === String(meId) ? receiverId : senderId;

        console.log('Fetching messages with user:', other);
        const msgRes = await fetch(`${BACKEND}/api/messages/${encodeURIComponent(other)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const msgBody = await msgRes.json().catch(() => null);
        if (!msgRes.ok) {
            console.error('Failed to fetch messages', msgRes.status, msgBody);
            process.exit(5);
        }

        console.log('Messages:', JSON.stringify(msgBody?.data?.messages || [], null, 2));
        process.exit(0);
    } catch (e) {
        console.error('Error', e);
        process.exit(10);
    }
}

run();
