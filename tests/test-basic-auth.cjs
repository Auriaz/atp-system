/**
 * Simple JWT Test using Node.js built-in fetch (Node 18+)
 * Tests user registration and login with JWT tokens
 */

const BASE_URL = 'http://localhost:3002';

// Test user data
const TEST_USER = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'TestPassword123!',
    password_confirmation: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    isAgreedToTerms: true
};

/**
 * Test user registration
 */
async function testRegistration() {
    console.log('🚀 Starting registration test...');
    console.log('📝 Testing user registration...');
    console.log('User data:', {
        username: TEST_USER.username,
        email: TEST_USER.email,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName
    });

    try {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(TEST_USER)
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            console.log('✅ Registration successful');
            console.log('📋 User created:', {
                id: data.payload.user?.id,
                email: data.payload.user?.email,
                username: data.payload.user?.username,
                hasAccessToken: !!data.payload.accessToken
            });
            return {
                user: data.payload.user,
                accessToken: data.payload.accessToken
            };
        } else {
            console.error('❌ Registration failed:', {
                status: response.status,
                message: data.message || 'Unknown error',
                details: data
            });
            return null;
        }
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        return null;
    }
}

/**
 * Test user login
 */
async function testLogin(email, password) {
    console.log('\n🔐 Testing user login...');

    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                rememberMe: false
            })
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            console.log('✅ Login successful');
            console.log('📋 Login response:', {
                hasAccessToken: !!data.payload.accessToken,
                expiresIn: data.payload.expiresIn,
                userId: data.payload.user?.id
            });
            return data.payload.accessToken;
        } else {
            console.error('❌ Login failed:', {
                status: response.status,
                message: data.message || 'Unknown error'
            });
            return null;
        }
    } catch (error) {
        console.error('❌ Login error:', error.message);
        return null;
    }
}

/**
 * Run the test
 */
async function runTest() {
    console.log('🚀 Starting JWT Authentication Test');
    console.log('='.repeat(40));

    // Step 1: Register a new user
    const registrationResult = await testRegistration();
    if (!registrationResult) {
        console.log('\n❌ Test failed: Could not register user');
        return;
    }

    // Step 2: Login with the registered user
    const accessToken = await testLogin(TEST_USER.email, TEST_USER.password);
    if (!accessToken) {
        console.log('\n❌ Test failed: Could not login');
        return;
    }

    console.log('\n' + '='.repeat(40));
    console.log('🎉 Basic JWT Authentication Test Complete!');
    console.log('✅ Registration and login working correctly');
    console.log('🔑 JWT tokens are being generated and returned');

    // Additional info
    console.log('\n📋 Summary:');
    console.log(`✓ User registered: ${TEST_USER.email}`);
    console.log(`✓ Login successful with JWT token`);
    console.log(`✓ Access token received: ${accessToken ? 'YES' : 'NO'}`);
}

// Run the test
runTest().catch(error => {
    console.error('💥 Test failed with error:', error);
    console.error('Stack trace:', error.stack);
});
