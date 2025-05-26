# ATP - Advanced Training Platform

## Project Description

ATP (Advanced Training Platform) is a comprehensive and modern fitness platform designed to help users create personalized training plans, analyze their progress, and maintain a workout journal. Our mission is to support users in achieving their fitness goals by providing precise and effective tools.

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
# Run session management validation
node tests/session-management/validate-session-management.cjs

# Run all tests
node tests/run-all-tests.cjs
```

## Key Features Implementation Status

- ✅ **User Authentication** - JWT-based auth with refresh tokens
- ✅ **Session Management** - Multi-device session tracking and control
- ✅ **Role-based Access Control** - Admin, Coach, Athlete, User roles
- ✅ **Responsive Design** - Modern UI with Nuxt UI components
- ✅ **Database Migrations** - Automated schema management
- ✅ **API Documentation** - Comprehensive endpoint documentation
- ✅ **Security Features** - Session monitoring, device tracking
- 🔄 **Training Plans** - In development
- 🔄 **Progress Analytics** - Planned
- 🔄 **Community Features** - Planned

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

