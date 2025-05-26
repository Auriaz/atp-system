// Simple API test for session management
async function testAPI() {
    console.log('🧪 Testing Session Management API...\n');

    try {
        // Test 1: Registration
        const email = `test_${Date.now()}@example.com`;
        const password = 'TestPassword123!';

        console.log('1️⃣ Registering user...');
        const registerRes = await fetch('http://localhost:3003/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: email,
                password: password
            })
        });

        if (!registerRes.ok) {
            const text = await registerRes.text();
            console.log('❌ Registration failed:', registerRes.status, text);
            return;
        }

        console.log('✅ User registered successfully');

        // Test 2: Login
        console.log('\n2️⃣ Logging in...');
        const loginRes = await fetch('http://localhost:3003/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!loginRes.ok) {
            console.log('❌ Login failed:', loginRes.status);
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('✅ Login successful');

        // Test 3: Get Sessions
        console.log('\n3️⃣ Fetching sessions...');
        const sessionsRes = await fetch('http://localhost:3003/api/auth/sessions', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!sessionsRes.ok) {
            console.log('❌ Failed to fetch sessions:', sessionsRes.status);
            return;
        }

        const sessionsData = await sessionsRes.json();
        console.log('✅ Sessions fetched successfully');
        console.log('📊 Statistics:', sessionsData.statistics);
        console.log('📱 Sessions:', sessionsData.sessions?.length || 0, 'found');

        if (sessionsData.sessions && sessionsData.sessions.length > 0) {
            console.log('\n📋 Session details:');
            sessionsData.sessions.forEach((session, i) => {
                console.log(`   ${i + 1}. ${session.device_name} - ${session.is_current ? 'Current' : 'Other'}`);
            });
        }

        console.log('\n🎉 API test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAPI();
