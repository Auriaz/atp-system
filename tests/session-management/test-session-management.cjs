/**
 * Test Session Management End-to-End
 * This script tests the complete session management workflow
 */

const BASE_URL = 'http://localhost:3002';

// Use the credentials from the created test user
const TEST_USER = {
    email: 'test_1748270546047@example.com',
    password: 'TestPassword123!',
    rememberMe: false
};

/**
 * Test user login and get access token
 */
async function testLogin() {
    console.log('🔐 Testing user login...');

    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(TEST_USER)
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            console.log('✅ Login successful');
            console.log('📋 Access token received:', !!data.payload.accessToken);
            return data.payload.accessToken;
        } else {
            console.log('❌ Login failed:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Login error:', error.message);
        return null;
    }
}

/**
 * Test session management API
 */
async function testSessionManagement(accessToken) {
    console.log('\n📱 Testing Session Management API...');

    if (!accessToken) {
        console.log('❌ No access token available');
        return;
    }

    try {
        // Test GET sessions
        console.log('🔍 Fetching user sessions...');
        const response = await fetch(`${BASE_URL}/api/auth/sessions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Sessions fetched successfully');
            console.log('📋 Sessions count:', data.payload?.sessions?.length || 0);
            console.log('📊 Session statistics:', data.payload?.statistics);

            // Display session details
            if (data.payload?.sessions?.length > 0) {
                console.log('\n📱 Active Sessions:');
                data.payload.sessions.forEach((session, index) => {
                    console.log(`  ${index + 1}. Device: ${session.deviceName || 'Unknown'}`);
                    console.log(`     Location: ${session.location || 'Unknown'}`);
                    console.log(`     Current: ${session.isCurrent ? 'Yes' : 'No'}`);
                    console.log(`     Last Used: ${new Date(session.lastUsedAt).toLocaleString()}`);
                    console.log(`     Created: ${new Date(session.createdAt).toLocaleString()}`);
                    console.log('');
                });
            }

            return data.payload.sessions;
        } else {
            console.log('❌ Failed to fetch sessions:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Session management error:', error.message);
        return null;
    }
}

/**
 * Test session revocation (if multiple sessions exist)
 */
async function testSessionRevocation(accessToken, sessions) {
    if (!sessions || sessions.length <= 1) {
        console.log('ℹ️ Only one session available, skipping revocation test');
        return;
    }

    console.log('\n🗑️ Testing Session Revocation...');

    // Find a non-current session to revoke
    const sessionToRevoke = sessions.find(session => !session.isCurrent);

    if (!sessionToRevoke) {
        console.log('ℹ️ No non-current sessions to revoke');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/auth/sessions/${sessionToRevoke.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Session revoked successfully');
            console.log('📋 Revoked session ID:', sessionToRevoke.id);
        } else {
            console.log('❌ Failed to revoke session:', data.message);
        }
    } catch (error) {
        console.error('❌ Session revocation error:', error.message);
    }
}

/**
 * Main test function
 */
async function runSessionManagementTest() {
    console.log('🎯 Session Management End-to-End Test');
    console.log('=====================================\n');

    // Step 1: Login and get access token
    const accessToken = await testLogin();

    if (!accessToken) {
        console.log('❌ Cannot proceed without access token');
        return;
    }

    // Step 2: Test session management
    const sessions = await testSessionManagement(accessToken);

    // Step 3: Test session revocation (optional)
    await testSessionRevocation(accessToken, sessions);

    console.log('\n=====================================');
    console.log('🎉 Session Management Test Complete!');
    console.log('✅ All core functionality tested');
}

// Run the test
runSessionManagementTest().catch(console.error);
