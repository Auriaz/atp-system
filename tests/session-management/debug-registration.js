// Using built-in fetch (Node 18+)

const BASE_URL = 'http://localhost:3003';

async function debugRegistration() {
    console.log('🔍 Debugging registration endpoint...\n');

    try {
        const registerData = {
            name: 'Debug Test User',
            email: `debug_test_${Date.now()}@example.com`,
            password: 'DebugTest123!'
        };

        console.log('📤 Sending registration request with data:');
        console.log(JSON.stringify(registerData, null, 2));

        const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        console.log('\n📥 Response status:', registerResponse.status);
        console.log('📥 Response headers:', Object.fromEntries(registerResponse.headers.entries()));

        const responseText = await registerResponse.text();
        console.log('📥 Response body:', responseText);

        if (!registerResponse.ok) {
            console.log('\n❌ Registration failed');
            try {
                const errorData = JSON.parse(responseText);
                console.log('🔍 Error details:', errorData);
            } catch (e) {
                console.log('🔍 Raw error text:', responseText);
            }
        } else {
            console.log('\n✅ Registration successful');
        }

    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
}

debugRegistration();
