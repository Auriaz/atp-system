// Simple test for session management
// Using built-in fetch (Node 18+)

const BASE_URL = 'http://localhost:3002';
const TEST_USER = {
    email: 'test_1748270546047@example.com',
    password: 'TestPassword123!',
    rememberMe: false
};

async function main() {
    console.log('Testing session management...');

    try {
        // Test login
        console.log('1. Testing login...');
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);

        if (loginData.status === 'success' && loginData.payload.accessToken) {
            console.log('2. Testing sessions API...');

            // Test sessions API
            const sessionsResponse = await fetch(`${BASE_URL}/api/auth/sessions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginData.payload.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const sessionsData = await sessionsResponse.json();
            console.log('Sessions response:', sessionsData);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
