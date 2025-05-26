// Using built-in fetch (Node 18+)

const BASE_URL = 'http://localhost:3003';

async function testSessionManagement() {
    console.log('🚀 Starting comprehensive session management test...\n');

    try {
        // Test 1: Create a test user
        console.log('1️⃣ Creating test user...');
        const registerData = {
            name: 'Session Test User',
            email: `session_test_${Date.now()}@example.com`,
            password: 'SessionTest123!'
        };

        const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        if (!registerResponse.ok) {
            throw new Error(`Registration failed: ${registerResponse.status}`);
        }

        const registerResult = await registerResponse.json();
        console.log('✅ User created successfully');
        console.log('📧 Email:', registerData.email);

        // Test 2: Login to get first session
        console.log('\n2️⃣ Logging in to create first session...');
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: registerData.email,
                password: registerData.password
            })
        });

        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginResponse.status}`);
        }

        const loginResult = await loginResponse.json();
        const token1 = loginResult.token;
        console.log('✅ First session created');

        // Test 3: Create multiple sessions (simulate different devices)
        console.log('\n3️⃣ Creating multiple sessions (simulating different devices)...');
        const sessions = [token1];

        for (let i = 2; i <= 4; i++) {
            const deviceLoginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: registerData.email,
                    password: registerData.password
                })
            });

            if (deviceLoginResponse.ok) {
                const deviceLoginResult = await deviceLoginResponse.json();
                sessions.push(deviceLoginResult.token);
                console.log(`✅ Session ${i} created (Device ${i})`);
            }
        }

        console.log(`📱 Total sessions created: ${sessions.length}`);

        // Test 4: Get session list
        console.log('\n4️⃣ Fetching session list...');
        const sessionsResponse = await fetch(`${BASE_URL}/api/auth/sessions`, {
            headers: { 'Authorization': `Bearer ${token1}` }
        });

        if (!sessionsResponse.ok) {
            throw new Error(`Get sessions failed: ${sessionsResponse.status}`);
        }

        const sessionsData = await sessionsResponse.json();
        console.log('✅ Sessions retrieved successfully');
        console.log('📊 Session statistics:');
        console.log(`   - Total sessions: ${sessionsData.statistics.totalSessions}`);
        console.log(`   - Active sessions: ${sessionsData.statistics.activeSessions}`);
        console.log(`   - Unique devices: ${sessionsData.statistics.uniqueDevices}`);
        console.log(`   - Unique locations: ${sessionsData.statistics.uniqueLocations}`);

        if (sessionsData.sessions && sessionsData.sessions.length > 0) {
            console.log('\n📋 Session details:');
            sessionsData.sessions.forEach((session, index) => {
                console.log(`   ${index + 1}. ID: ${session.id}`);
                console.log(`      Device: ${session.device_name || 'Unknown'}`);
                console.log(`      Location: ${session.location || 'Unknown'}`);
                console.log(`      Current: ${session.is_current ? '✅' : '❌'}`);
                console.log(`      Last active: ${new Date(session.updated_at).toLocaleString()}`);
                console.log('');
            });
        }

        // Test 5: Revoke a specific session
        if (sessionsData.sessions && sessionsData.sessions.length > 1) {
            console.log('5️⃣ Testing session revocation...');
            const sessionToRevoke = sessionsData.sessions.find(s => !s.is_current);

            if (sessionToRevoke) {
                const revokeResponse = await fetch(`${BASE_URL}/api/auth/sessions/${sessionToRevoke.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token1}` }
                });

                if (revokeResponse.ok) {
                    console.log(`✅ Session ${sessionToRevoke.id} revoked successfully`);
                } else {
                    console.log(`❌ Failed to revoke session: ${revokeResponse.status}`);
                }
            }
        }

        // Test 6: Get updated session list
        console.log('\n6️⃣ Fetching updated session list...');
        const updatedSessionsResponse = await fetch(`${BASE_URL}/api/auth/sessions`, {
            headers: { 'Authorization': `Bearer ${token1}` }
        });

        if (updatedSessionsResponse.ok) {
            const updatedSessionsData = await updatedSessionsResponse.json();
            console.log('✅ Updated sessions retrieved');
            console.log(`📊 New total sessions: ${updatedSessionsData.statistics.totalSessions}`);
        }

        // Test 7: Test bulk session revocation
        console.log('\n7️⃣ Testing bulk session revocation...');
        const bulkRevokeResponse = await fetch(`${BASE_URL}/api/auth/sessions/revoke`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token1}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'revoke_all_others' })
        });

        if (bulkRevokeResponse.ok) {
            console.log('✅ Bulk session revocation successful');

            // Check final session count
            const finalSessionsResponse = await fetch(`${BASE_URL}/api/auth/sessions`, {
                headers: { 'Authorization': `Bearer ${token1}` }
            });

            if (finalSessionsResponse.ok) {
                const finalSessionsData = await finalSessionsResponse.json();
                console.log(`📊 Final session count: ${finalSessionsData.statistics.totalSessions}`);
                console.log('   Should be 1 (only current session remaining)');
            }
        } else {
            console.log(`❌ Bulk revocation failed: ${bulkRevokeResponse.status}`);
        }

        console.log('\n🎉 Session management test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the test
testSessionManagement();
