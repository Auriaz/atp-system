// Multi-device session simulation test
const BASE_URL = 'http://localhost:3002';
const TEST_USER = {
    email: 'test_1748270546047@example.com',
    password: 'TestPassword123!',
    rememberMe: false
};

// Simulate different devices
const devices = [
    { name: 'Windows PC - Chrome', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
    { name: 'iPhone - Safari', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
    { name: 'Android - Chrome', userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' }
];

async function createMultipleSessions() {
    console.log('🔐 Creating multiple sessions from different devices...\n');

    const sessions = [];

    for (let i = 0; i < devices.length; i++) {
        const device = devices[i];
        console.log(`${i + 1}. Creating session for: ${device.name}`);

        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': device.userAgent
                },
                body: JSON.stringify(TEST_USER)
            });

            const data = await response.json();

            if (data.status === 'success') {
                console.log(`   ✅ Session created successfully`);
                sessions.push({
                    device: device.name,
                    token: data.payload.accessToken
                });
            } else {
                console.log(`   ❌ Failed to create session: ${data.message}`);
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return sessions;
}

async function checkAllSessions(token) {
    console.log('\n📱 Checking all active sessions...');

    try {
        const response = await fetch(`${BASE_URL}/api/auth/sessions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            console.log(`✅ Found ${data.data.stats.totalSessions} active sessions`);
            console.log(`📊 Device count: ${data.data.stats.devicesCount}`);

            console.log('\n📋 Session Details:');
            data.data.sessions.forEach((session, index) => {
                console.log(`   ${index + 1}. ${session.deviceName || 'Unknown Device'}`);
                console.log(`      Location: ${session.location || 'Unknown'}`);
                console.log(`      Current: ${session.isCurrent ? 'Yes' : 'No'}`);
                console.log(`      Last Used: ${new Date(session.lastUsedAt).toLocaleString()}`);
            });

            return data.data.sessions;
        } else {
            console.log(`❌ Failed to fetch sessions: ${data.message}`);
            return [];
        }
    } catch (error) {
        console.log(`❌ Error fetching sessions: ${error.message}`);
        return [];
    }
}

async function main() {
    console.log('🎯 Multi-Device Session Management Test');
    console.log('======================================\n');

    // Create multiple sessions
    const sessions = await createMultipleSessions();

    if (sessions.length > 0) {
        // Use the first session to check all sessions
        await checkAllSessions(sessions[0].token);

        console.log('\n🎉 Multi-device session test complete!');
        console.log('✅ You can now test the session management UI at:');
        console.log('   http://localhost:3002/dashboard/sessions');
    } else {
        console.log('❌ No sessions created');
    }
}

main().catch(console.error);
