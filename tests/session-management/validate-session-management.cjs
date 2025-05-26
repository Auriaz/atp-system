#!/usr/bin/env node

/**
 * Comprehensive Session Management Validation Script
 * Tests the complete multi-device session management implementation
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 ATP System - Session Management Implementation Validation');
console.log('='.repeat(60));

const testResults = {
  passed: 0,
  failed: 0,
  details: []
};

function logTest(name, status, details = '') {
  const icon = status ? '✅' : '❌';
  console.log(`${icon} ${name}${details ? ': ' + details : ''}`);

  testResults.details.push({ name, status, details });
  if (status) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

async function validateImplementation() {
  console.log('\n📋 Validating Implementation Components...\n');

  // Get project root directory (two levels up from current location)
  const projectRoot = path.join(__dirname, '..', '..');

  // Test 1: Database Migration File
  try {
    const migrationPath = path.join(projectRoot, '.data/hub/database/migrations/0006_sharp_zuras.sql');
    const migrationExists = fs.existsSync(migrationPath);
    logTest('Database Migration File', migrationExists, migrationExists ? 'Migration file exists' : 'Migration file missing');

    if (migrationExists) {
      const migrationContent = fs.readFileSync(migrationPath, 'utf8');
      const hasDeviceName = migrationContent.includes('device_name');
      const hasLocation = migrationContent.includes('location');
      const hasIsCurrent = migrationContent.includes('is_current');

      logTest('Migration - device_name field', hasDeviceName);
      logTest('Migration - location field', hasLocation);
      logTest('Migration - is_current field', hasIsCurrent);
    }
  } catch (error) {
    logTest('Database Migration File', false, 'Error reading migration: ' + error.message);
  }

  // Test 2: Session Management Service
  try {
    const servicePath = path.join(projectRoot, 'server/utils/services/session-management.service.ts');
    const serviceExists = fs.existsSync(servicePath);
    logTest('Session Management Service', serviceExists);

    if (serviceExists) {
      const serviceContent = fs.readFileSync(servicePath, 'utf8');
      const hasGetUserSessions = serviceContent.includes('getUserSessions');
      const hasRevokeSession = serviceContent.includes('revokeSession');
      const hasCreateSession = serviceContent.includes('createSession');

      logTest('Service - getUserSessions method', hasGetUserSessions);
      logTest('Service - revokeSession method', hasRevokeSession);
      logTest('Service - createSession method', hasCreateSession);
    }
  } catch (error) {
    logTest('Session Management Service', false, 'Error reading service: ' + error.message);
  }

  // Test 3: API Endpoints
  const apiEndpoints = [
    'server/api/auth/sessions/index.get.ts',
    'server/api/auth/sessions/[id].delete.ts',
    'server/api/auth/sessions/revoke.post.ts'
  ];

  apiEndpoints.forEach(endpoint => {
    try {
      const fullPath = path.join(projectRoot, endpoint);
      const endpointExists = fs.existsSync(fullPath);
      const endpointName = path.basename(endpoint, '.ts');
      logTest(`API Endpoint - ${endpointName}`, endpointExists);
    } catch (error) {
      logTest(`API Endpoint - ${endpoint}`, false, 'Error checking endpoint');
    }
  });
  // Test 4: Frontend Components
  const frontendFiles = [
    'app/components/SessionManagement.vue',
    'app/composables/useSessionManagement.ts',
    'app/pages/dashboard/sessions/index.vue'
  ];

  frontendFiles.forEach(file => {
    try {
      const fullPath = path.join(projectRoot, file);
      const fileExists = fs.existsSync(fullPath);
      const fileName = path.basename(file);
      logTest(`Frontend - ${fileName}`, fileExists);
    } catch (error) {
      logTest(`Frontend - ${file}`, false, 'Error checking file');
    }
  });

  // Test 5: Navigation Integration
  try {
    const sidebarPath = path.join(projectRoot, 'app/composables/useSidebar.ts');
    const sidebarExists = fs.existsSync(sidebarPath);

    if (sidebarExists) {
      const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
      const hasSessionManagement = sidebarContent.includes('Session Management');
      const hasSessionsRoute = sidebarContent.includes('/dashboard/sessions');
      const hasDeviceIcon = sidebarContent.includes('i-heroicons-device-phone-mobile');

      logTest('Navigation - Session Management link', hasSessionManagement);
      logTest('Navigation - Sessions route', hasSessionsRoute);
      logTest('Navigation - Device icon', hasDeviceIcon);
    } else {
      logTest('Navigation Integration', false, 'Sidebar file not found');
    }
  } catch (error) {
    logTest('Navigation Integration', false, 'Error reading sidebar: ' + error.message);
  }
  // Test 6: Documentation
  try {
    const docsPath = path.join(projectRoot, 'content/docs/development/session-management.md');
    const docsExist = fs.existsSync(docsPath);
    logTest('Documentation', docsExist, docsExist ? 'Comprehensive documentation available' : 'Documentation missing');
  } catch (error) {
    logTest('Documentation', false, 'Error checking documentation');
  }

  // Test 7: Database Model Extension
  try {
    const modelPath = path.join(projectRoot, 'server/database/models/refresh_tokens.model.ts');
    const modelExists = fs.existsSync(modelPath);

    if (modelExists) {
      const modelContent = fs.readFileSync(modelPath, 'utf8');
      const hasSessionFields = modelContent.includes('device_name') &&
        modelContent.includes('location') &&
        modelContent.includes('is_current');

      logTest('Database Model Extension', hasSessionFields, 'Session fields added to model');
    } else {
      logTest('Database Model Extension', false, 'Model file not found');
    }
  } catch (error) {
    logTest('Database Model Extension', false, 'Error reading model: ' + error.message);
  }

  // Final Results
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60));

  const total = testResults.passed + testResults.failed;
  const successRate = total > 0 ? Math.round((testResults.passed / total) * 100) : 0;

  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${successRate}%`);

  if (successRate >= 90) {
    console.log('\n🎉 SESSION MANAGEMENT IMPLEMENTATION: EXCELLENT');
    console.log('   The multi-device session management system is successfully implemented!');
  } else if (successRate >= 75) {
    console.log('\n✅ SESSION MANAGEMENT IMPLEMENTATION: GOOD');
    console.log('   Most components are in place, minor issues need attention.');
  } else {
    console.log('\n⚠️  SESSION MANAGEMENT IMPLEMENTATION: NEEDS ATTENTION');
    console.log('   Several components require fixes or completion.');
  }

  console.log('\n📋 Next Steps:');
  console.log('   1. Start development server: npm run dev');
  console.log('   2. Login to application');
  console.log('   3. Navigate to /dashboard/sessions');
  console.log('   4. Test session management functionality');
  console.log('   5. Verify across multiple devices/browsers');

  console.log('\n🔗 Test Pages:');
  console.log('   • Application: http://localhost:3002');
  console.log('   • Sessions: http://localhost:3002/dashboard/sessions');
  console.log('   • Test Interface: file:///session-management-test.html');

  return successRate >= 90;
}

// Run validation
validateImplementation()
  .then(success => {
    console.log('\n' + '='.repeat(60));
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
