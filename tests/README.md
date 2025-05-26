# 🧪 Tests Directory

This directory contains all test files for the JWT Authentication System.

## Test Files Overview

### Backend API Tests (Node.js)

#### Core Authentication Tests
- **`test-basic-auth.cjs`** - Basic authentication flow testing
- **`test-simple-jwt.cjs`** - Simplified JWT authentication test
- **`test-jwt-auth.cjs`** - Comprehensive JWT authentication testing

#### Token Management Tests
- **`test-token-refresh.cjs`** - Token refresh functionality testing
- **`test-auto-refresh.cjs`** - Automatic token refresh testing
- **`test-auto-logout.cjs`** - Automatic logout on refresh errors testing

#### Integration Tests
- **`test-composable-integration.cjs`** - Frontend composables integration testing
- **`test-jwt-flow.cjs`** - Complete JWT authentication flow testing
- **`test-final-validation.cjs`** - Comprehensive validation of the entire system

#### Utility Tests
- **`test-fetch.cjs`** - Fetch API availability and functionality testing

#### Test Runner & Server
- **`run-all-tests.cjs`** - Runs all authentication tests in sequence
- **`serve-browser-tests.cjs`** - HTTP server for serving browser test files

### Frontend Tests (Browser)

#### Interactive Browser Testing
- **`test-auth.html`** - Interactive browser-based authentication testing interface
  - User registration testing
  - Login/logout functionality
  - Protected endpoint access
  - Token refresh testing
  - **Automatic logout simulation**

### Session Management Tests
- **`session-management/`** - Complete test suite for multi-device session management
  - **`test-migration.js`** - Database migration validation
  - **`test-db-schema.js`** - Database schema verification using Drizzle ORM
  - **`validate-session-management.js`** - Comprehensive implementation validation
  - **`test-interface.html`** - Interactive browser testing interface
  - **`README.md`** - Session management test documentation

#### Test Runner & Server

## 🚀 How to Run Tests

### Backend Tests
```bash
# Run individual tests
node tests/test-basic-auth.cjs
node tests/test-auto-logout.cjs
node tests/test-final-validation.cjs

# Run all JWT tests
node tests/run-all-tests.cjs

# Run session management tests
cd tests/session-management
node test-migration.js
node validate-session-management.js
```

### Frontend Tests
1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Start the browser test server:
   ```bash
   node tests/serve-browser-tests.cjs
   ```

3. Open the browser test interface:
   ```
   http://localhost:3001/test-auth.html
   ```

4. Test session management interface:
   ```
   # Open session management test interface
   tests/session-management/test-interface.html
   
   # Or via development server
   http://localhost:3002/dashboard/sessions
   ```

### Session Management Tests
1. Ensure the development server is running.

2. Run the session management tests:
   ```bash
   node session-management/test-migration.js
   node session-management/test-db-schema.js
   node session-management/validate-session-management.js
   ```

3. Open the interactive session management test interface:
   ```
   http://localhost:3000/session-management/test-interface.html
   ```

## 📋 Test Categories

### ✅ Completed & Validated
- JWT token generation and validation
- User registration with automatic login
- Protected endpoint authentication
- Token refresh functionality
- **Automatic logout on refresh token errors**
- **Multi-device session management system**
- Error handling and user notifications

### 🧪 Test Coverage
- **Authentication Flow**: Registration → Login → Access → Refresh → Logout
- **Session Management**: Multi-device session monitoring, revocation, security
- **Error Scenarios**: Invalid tokens, expired refresh tokens, network errors
- **Security**: Token validation, refresh token rotation, automatic logout
- **User Experience**: Toast notifications, redirects, session management

## 🔧 Test Environment Requirements

### Prerequisites
- Node.js v22.14.0+
- Development server running on `http://localhost:3000`
- Database with JWT authentication system configured

### Dependencies
- Fetch API support (Node.js 18+)
- JWT middleware active
- Authentication endpoints available:
  - `/api/auth/register`
  - `/api/auth/login`
  - `/api/auth/refresh`
  - `/api/auth/logout`
  - `/api/test-jwt` (protected endpoint)

## 📊 Test Results Summary

All tests are currently **PASSING** ✅

- **Registration**: JWT tokens generated successfully
- **Authentication**: Protected endpoints accessible with Bearer tokens
- **Refresh Errors**: Properly detected and returned as 401 status
- **Auto-logout**: Automatic logout system functional
- **Integration**: Frontend composables properly handle all scenarios

---

**Last Updated**: May 26, 2025  
**Status**: All JWT authentication tests passing
**Auto-logout Implementation**: ✅ COMPLETED
