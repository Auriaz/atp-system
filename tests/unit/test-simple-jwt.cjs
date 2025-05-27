/**
 * Simple JWT Flow Test with debugging
 */

const BASE_URL = 'http://localhost:3000';

async function simpleTest() {
    console.log('🚀 Starting Simple JWT Test');

    try {
        console.log('📝 Testing registration endpoint...');

        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: `simple_${Date.now()}`,
                email: `simple_${Date.now()}@example.com`,
                password: 'TestPassword123!',
                password_confirmation: 'TestPassword123!',
                firstName: 'Simple',
                lastName: 'Test',
                isAgreedToTerms: true
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries())); if (response.ok) {
            const data = await response.json();
            console.log('✅ Registration successful:', data);

            // Get cookies and access token for next request
            const cookies = response.headers.get('set-cookie');
            const accessToken = data.payload?.accessToken;

            console.log('🍪 Cookies received:', cookies);
            console.log('🔑 Access token received:', accessToken ? 'YES' : 'NO');

            if (accessToken) {
                console.log('🔐 Testing protected endpoint with access token...');
                const protectedResponse = await fetch(`${BASE_URL}/api/test-jwt`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Cookie': cookies || ''
                    }
                });

                console.log('Protected endpoint status:', protectedResponse.status);

                if (protectedResponse.ok) {
                    const protectedData = await protectedResponse.json();
                    console.log('✅ Protected endpoint data:', protectedData);
                } else {
                    const errorData = await protectedResponse.text();
                    console.log('❌ Protected endpoint error:', errorData);
                }
            }

        } else {
            const errorData = await response.text();
            console.log('❌ Registration failed:', errorData);
        }

    } catch (error) {
        console.error('💥 Test error:', error.message);
    }

    console.log('✅ Test complete');
}

simpleTest();
