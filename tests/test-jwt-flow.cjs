/**
 * Comprehensive JWT Flow Test
 * Tests the complete authentication flow including token refresh
 */

const BASE_URL = 'http://localhost:3002';

// Test user data
const TEST_USER = {
    username: `flowtest_${Date.now()}`,
    email: `flowtest_${Date.now()}@example.com`,
    password: 'TestPassword123!',
    password_confirmation: 'TestPassword123!',
    firstName: 'Flow',
    lastName: 'Test',
    isAgreedToTerms: true
};

let cookies = '';

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

/**
 * Test complete flow
 */
async function testCompleteFlow() {
    console.log('🚀 Starting Comprehensive JWT Flow Test');
    console.log('========================================');

    try {
        // Step 1: Register user
        console.log('📝 Step 1: User Registration...');
        const registerResponse = await makeRequest(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            body: JSON.stringify(TEST_USER)
        });

        if (!registerResponse.ok) {
            const error = await registerResponse.text();
            console.error('❌ Registration failed:', error);
            return;
        }

        const registerData = await registerResponse.json();
        console.log('✅ Registration successful:', registerData);

        // Step 2: Test protected endpoint immediately after registration
        console.log('\n🔐 Step 2: Testing Protected Endpoint...');
        const protectedResponse = await makeRequest(`${BASE_URL}/api/test-jwt`);

        if (protectedResponse.ok) {
            const protectedData = await protectedResponse.json();
            console.log('✅ Protected endpoint accessible:', protectedData);
        } else {
            console.log('❌ Protected endpoint failed:', protectedResponse.status);
        }

        // Step 3: Test token refresh
        console.log('\n🔄 Step 3: Testing Token Refresh...');
        const refreshResponse = await makeRequest(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST'
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            console.log('✅ Token refresh successful:', refreshData);
        } else {
            console.log('❌ Token refresh failed:', refreshResponse.status);
        }

        // Step 4: Test protected endpoint after refresh
        console.log('\n🔐 Step 4: Testing Protected Endpoint After Refresh...');
        const protectedResponse2 = await makeRequest(`${BASE_URL}/api/test-jwt`);

        if (protectedResponse2.ok) {
            const protectedData2 = await protectedResponse2.json();
            console.log('✅ Protected endpoint still accessible:', protectedData2);
        } else {
            console.log('❌ Protected endpoint failed after refresh:', protectedResponse2.status);
        }

        // Step 5: Test logout
        console.log('\n🚪 Step 5: Testing Logout...');
        const logoutResponse = await makeRequest(`${BASE_URL}/api/auth/logout`, {
            method: 'POST'
        });

        if (logoutResponse.ok) {
            console.log('✅ Logout successful');
        } else {
            console.log('❌ Logout failed:', logoutResponse.status);
        }

        // Step 6: Test protected endpoint after logout
        console.log('\n🔐 Step 6: Testing Protected Endpoint After Logout...');
        const protectedResponse3 = await makeRequest(`${BASE_URL}/api/test-jwt`);

        if (protectedResponse3.ok) {
            console.log('❌ Protected endpoint still accessible after logout - this is wrong!');
        } else {
            console.log('✅ Protected endpoint correctly blocked after logout:', protectedResponse3.status);
        }

        console.log('\n========================================');
        console.log('🎉 Comprehensive JWT Flow Test Complete!');

    } catch (error) {
        console.error('💥 Test failed with error:', error);
    }
}

// Run the test
testCompleteFlow();
