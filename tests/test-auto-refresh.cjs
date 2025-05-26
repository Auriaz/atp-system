/**
 * Test script for automatic token refresh functionality
 * This script tests the token refresh mechanism in the JWT composables
 */

const baseUrl = 'http://localhost:3000';

async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return { success: response.ok, status: response.status, data, headers: response.headers };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function testAutoRefreshFlow() {
    console.log('🔄 Testing Automatic Token Refresh Flow\n');
    // Step 1: Register a new user
    console.log('1️⃣ Registering test user...');
    const registerResult = await makeRequest(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: `refresh_test_${Date.now()}`,
            email: `refresh-test-${Date.now()}@example.com`,
            password: 'TestPassword123!',
            password_confirmation: 'TestPassword123!',
            firstName: 'Refresh',
            lastName: 'Test',
            isAgreedToTerms: true
        })
    });

    if (!registerResult.success) {
        console.log('❌ Registration failed:', registerResult);
        return;
    } console.log('✅ Registration successful');
    console.log('📝 Registration response:', registerResult.data);

    const accessToken = registerResult.data.accessToken ||
        registerResult.data.access_token ||
        registerResult.data.payload?.accessToken;

    if (!accessToken) {
        console.log('❌ No access token in response');
        return;
    }

    console.log(`📝 Access token: ${accessToken.substring(0, 50)}...`);

    // Step 2: Extract refresh token from Set-Cookie header
    const setCookieHeader = registerResult.headers.get('set-cookie');
    console.log(`🍪 Set-Cookie header: ${setCookieHeader}`);

    // Step 3: Make a request to protected endpoint
    console.log('\n2️⃣ Testing protected endpoint with access token...');
    const protectedResult = await makeRequest(`${baseUrl}/api/test-jwt`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Cookie': setCookieHeader
        }
    });

    if (protectedResult.success) {
        console.log('✅ Protected endpoint accessible');
        console.log('📊 Token info:', protectedResult.data);
    } else {
        console.log('❌ Protected endpoint failed:', protectedResult);
    }

    // Step 4: Wait for token to approach expiry (simulating near-expiry scenario)
    console.log('\n3️⃣ Simulating token refresh scenario...');
    console.log('⏳ In a real scenario, the composable would detect token expiry and refresh automatically');

    // Step 5: Test manual refresh endpoint
    console.log('\n4️⃣ Testing manual token refresh...');
    const refreshResult = await makeRequest(`${baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
            'Cookie': setCookieHeader
        }
    });
    if (refreshResult.success) {
        console.log('✅ Token refresh successful');
        console.log('📝 Refresh response:', refreshResult.data);

        const newAccessToken = refreshResult.data.accessToken ||
            refreshResult.data.access_token ||
            refreshResult.data.payload?.accessToken;

        if (!newAccessToken) {
            console.log('❌ No access token in refresh response');
            return;
        }

        console.log(`📝 New access token: ${newAccessToken.substring(0, 50)}...`);
        // Step 6: Test protected endpoint with new token
        console.log('\n5️⃣ Testing protected endpoint with refreshed token...');
        const newProtectedResult = await makeRequest(`${baseUrl}/api/test-jwt`, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Cookie': setCookieHeader
            }
        });

        if (newProtectedResult.success) {
            console.log('✅ Protected endpoint accessible with refreshed token');
            console.log('📊 New token info:', newProtectedResult.data);
        } else {
            console.log('❌ Protected endpoint failed with refreshed token:', newProtectedResult);
        }
    } else {
        console.log('❌ Token refresh failed:', refreshResult);
    }

    console.log('\n🏁 Auto-refresh test completed!');
}

// Run the test
testAutoRefreshFlow().catch(console.error);
