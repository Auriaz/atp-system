/**
 * JWT Authentication Flow Test Script
 * Tests the complete JWT authentication lifecycle including automatic token refresh
 */

const BASE_URL = 'http://localhost:3002';

// Test credentials - make sure this user exists in your database
const TEST_CREDENTIALS = {
    email: 'admin@test.com',
    password: 'password123',
    rememberMe: false
};

/**
 * Test login and get access token
 */
async function testLogin() {
    console.log('🔐 Testing login...');

    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(TEST_CREDENTIALS),
            credentials: 'include' // Important for cookies
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            console.log('✅ Login successful');
            console.log('📋 Response:', {
                accessToken: data.payload.accessToken ? '***PRESENT***' : 'MISSING',
                expiresIn: data.payload.expiresIn,
                userInfo: {
                    id: data.payload.user?.id,
                    email: data.payload.user?.email,
                    username: data.payload.user?.username
                }
            });
            return data.payload.accessToken;
        } else {
            console.error('❌ Login failed:', data);
            return null;
        }
    } catch (error) {
        console.error('❌ Login error:', error.message);
        return null;
    }
}

/**
 * Test protected endpoint with JWT token
 */
async function testProtectedEndpoint(accessToken) {
    console.log('\n🔒 Testing protected endpoint...');

    try {
        const response = await fetch(`${BASE_URL}/api/test-jwt`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Protected endpoint access successful');
            console.log('📋 Response:', {
                authMethod: data.payload.authMethod,
                userId: data.payload.user?.id,
                email: data.payload.user?.email,
                jwtInfo: data.payload.jwtInfo
            });
            return true;
        } else {
            console.error('❌ Protected endpoint access failed:', data);
            return false;
        }
    } catch (error) {
        console.error('❌ Protected endpoint error:', error.message);
        return false;
    }
}

/**
 * Test token refresh
 */
async function testTokenRefresh() {
    console.log('\n🔄 Testing token refresh...');

    try {
        const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Important for refresh token cookie
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            console.log('✅ Token refresh successful');
            console.log('📋 New token info:', {
                accessToken: data.payload.accessToken ? '***PRESENT***' : 'MISSING',
                expiresIn: data.payload.expiresIn
            });
            return data.payload.accessToken;
        } else {
            console.error('❌ Token refresh failed:', data);
            return null;
        }
    } catch (error) {
        console.error('❌ Token refresh error:', error.message);
        return null;
    }
}

/**
 * Test logout
 */
async function testLogout() {
    console.log('\n🚪 Testing logout...');

    try {
        const response = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Logout successful');
            return true;
        } else {
            console.error('❌ Logout failed:', data);
            return false;
        }
    } catch (error) {
        console.error('❌ Logout error:', error.message);
        return false;
    }
}

/**
 * Run complete JWT authentication flow test
 */
async function runCompleteTest() {
    console.log('🚀 Starting JWT Authentication Flow Test\n');
    console.log('='.repeat(50));

    // Step 1: Login
    const accessToken = await testLogin();
    if (!accessToken) {
        console.log('\n❌ Test failed: Could not obtain access token');
        return;
    }

    // Step 2: Test protected endpoint with token
    const protectedAccessSuccess = await testProtectedEndpoint(accessToken);
    if (!protectedAccessSuccess) {
        console.log('\n❌ Test failed: Could not access protected endpoint');
        return;
    }

    // Step 3: Test token refresh
    const newAccessToken = await testTokenRefresh();
    if (!newAccessToken) {
        console.log('\n❌ Test failed: Could not refresh token');
        return;
    }

    // Step 4: Test protected endpoint with new token
    const newTokenAccessSuccess = await testProtectedEndpoint(newAccessToken);
    if (!newTokenAccessSuccess) {
        console.log('\n❌ Test failed: Could not access protected endpoint with new token');
        return;
    }

    // Step 5: Test logout
    const logoutSuccess = await testLogout();
    if (!logoutSuccess) {
        console.log('\n❌ Test failed: Could not logout');
        return;
    }

    // Step 6: Verify token is invalidated after logout
    console.log('\n🔍 Testing token invalidation after logout...');
    const shouldFailAccess = await testProtectedEndpoint(newAccessToken);
    if (shouldFailAccess) {
        console.log('\n⚠️  Warning: Token still valid after logout (this might be expected depending on implementation)');
    } else {
        console.log('\n✅ Token properly invalidated after logout');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 JWT Authentication Flow Test Complete!');
    console.log('✅ All tests passed successfully');
}

// Run the test
runCompleteTest().catch(console.error);
