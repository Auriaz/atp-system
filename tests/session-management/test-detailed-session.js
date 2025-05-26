// Detailed session management test
// Using built-in fetch (Node 18+)

const BASE_URL = 'http://localhost:3002';
const TEST_USER = {
    email: 'test_1748270546047@example.com',
    password: 'TestPassword123!',
    rememberMe: false
};

async function main() {
    console.log('🎯 Detailed Session Management Test');
    console.log('===================================\n');

    try {
        // Test login
        console.log('1. 🔐 Testing login...');
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        const loginData = await loginResponse.json();

        if (loginData.status === 'success' && loginData.payload.accessToken) {
            console.log('✅ Login successful');
            console.log(`📋 User ID: ${JSON.parse(atob(loginData.payload.accessToken.split('.')[1])).userId}`);
            console.log(`⏰ Token expires in: ${loginData.payload.expiresIn} seconds\n`);

            // Test sessions API
            console.log('2. 📱 Testing sessions API...');
            const sessionsResponse = await fetch(`${BASE_URL}/api/auth/sessions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginData.payload.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const sessionsData = await sessionsResponse.json();

            if (sessionsData.success) {
                console.log('✅ Sessions fetched successfully');
                console.log('\n📊 Session Statistics:');
                console.log(`   Total Sessions: ${sessionsData.data.stats.totalSessions}`);
                console.log(`   Active Sessions: ${sessionsData.data.stats.activeSessions}`);
                console.log(`   Device Count: ${sessionsData.data.stats.devicesCount}`);
                console.log(`   Last Activity: ${new Date(sessionsData.data.stats.lastActivity).toLocaleString()}`);

                console.log('\n📱 Session Details:');
                sessionsData.data.sessions.forEach((session, index) => {
                    console.log(`   ${index + 1}. Session ID: ${session.id}`);
                    console.log(`      Device: ${session.deviceName || 'Unknown Device'}`);
                    console.log(`      Location: ${session.location || 'Unknown Location'}`);
                    console.log(`      IP: ${session.ipAddress || 'Unknown'}`);
                    console.log(`      Current Session: ${session.isCurrent ? '✅ Yes' : '❌ No'}`);
                    console.log(`      Created: ${new Date(session.createdAt).toLocaleString()}`);
                    console.log(`      Last Used: ${new Date(session.lastUsedAt).toLocaleString()}`);
                    console.log(`      Expires: ${new Date(session.expiresAt).toLocaleString()}`);
                    console.log('');
                });

                // Test session revocation (find a non-current session)
                const nonCurrentSession = sessionsData.data.sessions.find(s => !s.isCurrent);
                if (nonCurrentSession) {
                    console.log('3. 🗑️ Testing session revocation...');
                    const revokeResponse = await fetch(`${BASE_URL}/api/auth/sessions/${nonCurrentSession.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${loginData.payload.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    const revokeData = await revokeResponse.json();
                    if (revokeData.success) {
                        console.log(`✅ Session ${nonCurrentSession.id} revoked successfully`);
                    } else {
                        console.log(`❌ Failed to revoke session: ${revokeData.message}`);
                    }
                } else {
                    console.log('3. ℹ️ Only current session available, skipping revocation test');
                }

                // Test bulk session management
                console.log('\n4. 🔄 Testing bulk session operations...');
                const bulkResponse = await fetch(`${BASE_URL}/api/auth/sessions/revoke`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${loginData.payload.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'revoke-others' // Keep current session, revoke others
                    })
                });

                const bulkData = await bulkResponse.json();
                if (bulkData.success) {
                    console.log(`✅ Bulk operation successful: ${bulkData.data.revokedCount} sessions revoked`);
                } else {
                    console.log(`❌ Bulk operation failed: ${bulkData.message}`);
                }

            } else {
                console.log('❌ Failed to fetch sessions:', sessionsData.message);
            }

        } else {
            console.log('❌ Login failed:', loginData.message);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    console.log('\n===================================');
    console.log('🎉 Session Management Test Complete!');
}

main();
