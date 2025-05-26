// Test session revocation
async function testRevocation() {
    const BASE_URL = 'http://localhost:3002';
    const TEST_USER = {
        email: 'test_1748270546047@example.com',
        password: 'TestPassword123!'
    };

    console.log('🔐 Logging in...');
    const loginResp = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER)
    });
    const login = await loginResp.json();
    const token = login.payload.accessToken;

    console.log('📱 Getting sessions...');
    const sessionsResp = await fetch(`${BASE_URL}/api/auth/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const sessions = await sessionsResp.json();

    console.log(`Found ${sessions.data.sessions.length} sessions`);

    // Find a non-current session to revoke
    const toRevoke = sessions.data.sessions.find(s => !s.isCurrent);

    if (toRevoke) {
        console.log(`🗑️ Revoking session ${toRevoke.id}...`);
        const revokeResp = await fetch(`${BASE_URL}/api/auth/sessions/${toRevoke.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const revoke = await revokeResp.json();
        console.log('Revoke result:', revoke.success ? 'SUCCESS' : 'FAILED');

        // Check sessions again
        const newSessionsResp = await fetch(`${BASE_URL}/api/auth/sessions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const newSessions = await newSessionsResp.json();
        console.log(`Now have ${newSessions.data.sessions.length} sessions`);
    } else {
        console.log('No non-current sessions to revoke');
    }
}

testRevocation().catch(console.error);
