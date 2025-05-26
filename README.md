# ATP - Advanced Training Platform

> **Status projektu**: ✅ **Session Management System - 100% Complete** (19/19 testów passed)  
> **Ostatnia aktualizacja**: 26 maja 2025  
> **Gotowość**: Production-ready session management, organized test structure

## Project Description

ATP (Advanced Training Platform) is a comprehensive and modern fitness platform designed to help users create personalized training plans, analyze their progress, and maintain a workout journal. Our mission is to support users in achieving their fitness goals by providing precise and effective tools.

## 📚 Quick Start for Developers

**New to the project?** Start here:
1. **Read the [Developer Guide](./DEVELOPER_GUIDE.md)** - Complete development procedures and best practices
2. **Check [Session Management Report](./content/docs/development/raport-implementacji-sesji.md)** - Current implementation status
3. **Review [Test Organization](./tests/README.md)** - Testing structure and validation

## Features

- **Personalized Training Plans:** Create plans tailored to your needs and goals.
- **Workout Data Analysis:** Use advanced tools to monitor your progress and adjust your plans.
- **Workout Journal:** Keep a detailed log of your workouts to track progress and stay motivated.
- **Community Support:** Join a community of like-minded individuals for support and motivation.
- **Progress Tracking:** Utilize tools to monitor your progress and generate reports to see your achievements.
- **Multi-Device Session Management:** Secure session management across multiple devices with the ability to view, monitor, and revoke active sessions for enhanced security.

## Technologies

- **Frontend:** Nuxt 3, Vue 3, Nuxt UI, Tailwind CSS
- **Backend:** Nitro, Node.js
- **Database:** Drizzle ORM, SQLite
- **Authentication:** JWT with refresh tokens
- **Session Management:** Multi-device session tracking and management
- **TypeScript:** Full type safety across the stack

## Project Structure

### Frontend (`app/` directory)

```
app/
├── components/           # Vue components
│   └── SessionManagement.vue
├── composables/          # Vue composables
│   ├── useAuth.ts
│   ├── useSessionManagement.ts
│   └── ...
├── pages/               # File-based routing
│   └── dashboard/
│       ├── sessions.vue # Session management page
│       └── ...
├── layouts/            # Application layouts
├── middleware/         # Route middleware
└── plugins/           # Nuxt plugins
```

### Backend (`server/` directory)

```
server/
├── api/                # API endpoints
│   └── auth/
│       └── sessions/   # Session management API
├── database/           # Database schema & migrations
├── middleware/         # Server middleware
└── utils/             # Server utilities
    └── services/
        └── session-management.service.ts
```

### Content & Documentation (`content/` directory)

```
content/
└── docs/              # Project documentation
    ├── development/   # Development guides
    │   ├── session-management.md
    │   └── użytkownicy.md
    └── ...
```

## Session Management Features

The ATP System includes comprehensive multi-device session management:

### Core Capabilities

- **Device Recognition:** Automatic detection of device type and browser
- **Location Tracking:** IP-based geographical location for security
- **Session Monitoring:** Real-time view of all active sessions
- **Secure Logout:** Revoke individual sessions or all sessions except current
- **Security Dashboard:** Session statistics and security recommendations

### Security Features

- **Current Session Protection:** Prevents accidental self-logout
- **Bulk Management:** Quick logout from all devices for security incidents
- **Session Validation:** Automatic cleanup of expired sessions
- **Real-time Updates:** Live session status monitoring

### Access

- **Route:** `/dashboard/sessions`
- **Navigation:** Available through sidebar "Session Management" link
- **Authentication:** Requires valid JWT token

## Development

### 📖 Developer Guide

**For comprehensive development information, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)**

The Developer Guide includes:
- 🏗️ Complete technology stack overview
- 🔧 Development environment setup
- 📁 Detailed project structure explanation
- 🚀 Development workflows and procedures
- 🧪 Testing strategies and commands
- 🐛 Common issues and debugging tips
- ✅ Pre-deployment checklists

### Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
git clone <repository-url>
cd atp-system
pnpm install
```

### Development Server

```bash
pnpm dev
# Server runs on http://localhost:3000
```

### Database Setup

```bash
# Apply migrations
pnpm db:migrate

# Seed database (optional)
pnpm db:seed
```

### Testing

```bash
# ✅ Run session management validation (100% success - 19/19 tests)
cd tests/session-management
node validate-session-management.cjs

# Run all tests
node tests/run-all-tests.cjs

# Start browser test server
cd tests
node serve-browser-tests.cjs
# Then open http://localhost:8080
```

## Key Features Implementation Status

- ✅ **User Authentication** - JWT-based auth with refresh tokens (100% complete)
- ✅ **Session Management** - Multi-device session tracking and control (100% complete, 19/19 tests passed)
- ✅ **Role-based Access Control** - Admin, Coach, Athlete, User roles (implemented)
- ✅ **Responsive Design** - Modern UI with Nuxt UI components (implemented)
- ✅ **Database Migrations** - Automated schema management (working)
- ✅ **API Documentation** - Comprehensive endpoint documentation (current)
- ✅ **Security Features** - Session monitoring, device tracking (fully functional)
- ✅ **Test Organization** - All tests organized in proper structure (15 files in tests/session-management/)
- ✅ **Developer Documentation** - Complete developer guide with procedures (current)
- 🔄 **Training Plans** - In development
- 🔄 **Progress Analytics** - Planned  
- 🔄 **Community Features** - Planned

### 📊 Current Quality Metrics
```
✅ Session Management Tests: 19/19 passed (100% success)
✅ Code Quality: ESLint clean, TypeScript error-free
✅ Build Status: Successful compilation
✅ Documentation: Up-to-date and comprehensive
✅ Test Organization: Fully restructured and documented
```

## Contributing

### For New Contributors
1. **Start with the [Developer Guide](./DEVELOPER_GUIDE.md)** - Essential reading for development procedures
2. **Check current project status** in implementation reports
3. **Review test structure** in `tests/` directory

### Development Workflow
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow the development procedures** outlined in DEVELOPER_GUIDE.md
4. **Run validation tests** to ensure quality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Quality Standards
- ✅ All tests must pass (especially session management: 19/19)
- ✅ ESLint compliance required
- ✅ TypeScript error-free compilation
- ✅ Documentation updates for new features
- ✅ Proper test organization in respective directories

## License

This project is licensed under the MIT License.

