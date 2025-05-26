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

// Session management test files
const sessionTestFiles = [
    'session-management/test-migration.js',
    'session-management/validate-session-management.cjs'
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

// Running session management tests
for (const testFile of sessionTestFiles) {
    const testPath = path.join(testsDir, testFile);

    try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🔄 Running Session Management Test: ${testFile}`);
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
console.log('🔄 Running Session Management Tests...');
console.log(`${'='.repeat(60)}`);

// Run session management tests
for (const testFile of sessionTestFiles) {
    const testPath = path.join(testsDir, testFile);

    try {
        console.log(`\n${'='.repeat(40)}`);
        console.log(`🔄 Running: ${testFile}`);
        console.log(`${'='.repeat(40)}`);

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
console.log('🎯 Complete Test Suite Finished!');
console.log(`${'='.repeat(60)}`);
console.log('\n📱 For browser testing, access:');
console.log('   JWT Auth: tests/test-auth.html');
console.log('   Session Management: tests/session-management/test-interface.html');
console.log('   Live App: http://localhost:3002/dashboard/sessions');
console.log('\n🚀 All authentication and session management tests executed!');
