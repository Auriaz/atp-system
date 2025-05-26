/**
 * Token Refresh Test
 * Tests the automatic token refresh functionality
 */

const BASE_URL = 'http://localhost:3000';

let cookies = '';
let accessToken = '';

/**
 * Helper to make authenticated requests with cookies
 */
async function makeRequest(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (cookies) {
        headers['Cookie'] = cookies;
    }

    if (accessToken && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    // Capture cookies from response
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
        cookies = setCookieHeader;
    }

    return response;
}

async function testTokenRefresh() {
    console.log('🔄 Starting Token Refresh Test');
    console.log('========================================');

    try {
        // Step 1: Register and get initial tokens
        console.log('📝 Step 1: Register user...');
        const registerResponse = await makeRequest(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            body: JSON.stringify({
                username: `refresh_test_${Date.now()}`,
                email: `refresh_test_${Date.now()}@example.com`,
                password: 'TestPassword123!',
                password_confirmation: 'TestPassword123!',
                firstName: 'Refresh',
                lastName: 'Test',
                isAgreedToTerms: true
            })
        });

        if (!registerResponse.ok) {
            console.error('❌ Registration failed');
            return;
        }

        const registerData = await registerResponse.json();
        accessToken = registerData.payload.accessToken;
        console.log('✅ Initial access token received');

        // Step 2: Test refresh endpoint
        console.log('\n🔄 Step 2: Test token refresh...');
        const refreshResponse = await makeRequest(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST'
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const newAccessToken = refreshData.payload?.accessToken;

            console.log('✅ Token refresh successful');
            console.log('📋 New access token received:', newAccessToken ? 'YES' : 'NO');

            if (newAccessToken) {
                console.log('🔍 Comparing tokens...');
                console.log('  Old token length:', accessToken.length);
                console.log('  New token length:', newAccessToken.length);
                console.log('  Tokens different:', accessToken !== newAccessToken ? 'YES' : 'NO');

                // Update access token
                accessToken = newAccessToken;

                // Step 3: Test protected endpoint with new token
                console.log('\n🔐 Step 3: Test protected endpoint with new token...');
                const protectedResponse = await makeRequest(`${BASE_URL}/api/test-jwt`);

                if (protectedResponse.ok) {
                    const protectedData = await protectedResponse.json();
                    console.log('✅ Protected endpoint accessible with new token');
                    console.log('📋 JWT Info:', protectedData.payload.jwtInfo);
                } else {
                    console.log('❌ Protected endpoint failed with new token');
                }
            }
        } else {
            const errorData = await refreshResponse.text();
            console.log('❌ Token refresh failed:', errorData);
        }

        console.log('\n========================================');
        console.log('🎉 Token Refresh Test Complete!');

    } catch (error) {
        console.error('💥 Test failed:', error.message);
    }
}

testTokenRefresh();
