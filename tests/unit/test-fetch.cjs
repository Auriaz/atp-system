console.log('Testing fetch availability...');

async function testFetch() {
    try {
        const response = await fetch('http://localhost:3000/api/test-jwt');
        console.log('Fetch is available!');
        console.log('Response status:', response.status);
    } catch (error) {
        console.log('Fetch error:', error.message);
    }
}

testFetch();
