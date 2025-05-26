#!/usr/bin/env node

/**
 * Test Runner Script
 * Runs all JWT authentication tests from the tests directory
 */

const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
    'test-basic-auth.cjs',
    'test-simple-jwt.cjs',
    'test-token-refresh.cjs',
    'test-auto-logout.cjs',
    'test-composable-integration.cjs',
    'test-final-validation.cjs'
];

console.log('🧪 Running JWT Authentication Test Suite...\n');

const testsDir = path.join(__dirname);

for (const testFile of testFiles) {
    const testPath = path.join(testsDir, testFile);

    try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🔄 Running: ${testFile}`);
        console.log(`${'='.repeat(60)}`);

        execSync(`node "${testPath}"`, {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
        });

        console.log(`\n✅ ${testFile} completed successfully`);

    } catch (error) {
        console.error(`\n❌ ${testFile} failed:`, error.message);
    }
}

console.log(`\n${'='.repeat(60)}`);
console.log('🎯 Test Suite Complete!');
console.log(`${'='.repeat(60)}`);
console.log('\n📱 For browser testing, start the dev server and access:');
console.log('   File: tests/test-auth.html');
console.log('   Note: Serve this file through a local server');
console.log('\n🚀 All JWT authentication tests executed!');
