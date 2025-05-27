# ATP System - Commit Guide & Quick Commands

## 🚀 Current Development Status (May 27, 2025)

### IMMEDIATE PRIORITY: PHASE 0 - Documentation Organization
**Branch**: `feature/docs-organization`
**Timeline**: 1-2 weeks
**Status**: Ready to start

## 📝 Commit Message Convention

### Standard Format
```
type(scope): description

[optional body]

[optional footer]
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `config`: Configuration changes

### Scopes for ATP System
- `auth`: Authentication system
- `users`: User management
- `profile`: User profiles
- `sessions`: Session management
- `docs`: Documentation
- `content`: Content management
- `training`: Training management (PHASE 2+)
- `athletes`: Athlete management (PHASE 3+)
- `workout`: Workout execution (PHASE 4+)
- `notifications`: Notifications system (PHASE 5+)
- `analytics`: Analytics system (PHASE 6+)
- `ui`: UI components
- `api`: API endpoints
- `db`: Database changes

## 🎯 PHASE 0 - Quick Commit Commands

### 1. Start PHASE 0 Branch
```powershell
# Create and switch to documentation branch
git checkout develop
git pull origin develop
git checkout -b feature/docs-organization

# Push initial branch
git push -u origin feature/docs-organization
```

### 2. Documentation Structure Organization
```powershell
# After organizing /content/docs/ structure
git add content/docs/
git commit -m "docs(content): reorganize documentation structure

- Standardize naming conventions across doc categories
- Create consistent navigation structure
- Implement proper cross-references between documents
- Add missing documentation for existing features

Refs: PHASE 0.1 - Documentation Structure Organization"

git push origin feature/docs-organization
```

### 3. Documentation Management System
```powershell
# After implementing doc management features
git add .
git commit -m "feat(docs): implement documentation management system

- Add documentation index and navigation system
- Implement search functionality for documentation
- Add documentation versioning system
- Create templates for new documentation
- Establish documentation review and approval process

Refs: PHASE 0.1 - Documentation Management System"

git push origin feature/docs-organization
```

### 4. Content Management Enhancement
```powershell
# After content management improvements
git add .
git commit -m "feat(content): enhance content management system

- Standardize markdown formatting across all docs
- Create documentation style guide
- Implement automatic link validation
- Add documentation health checks

Refs: PHASE 0.1 - Content Management Enhancement"

git push origin feature/docs-organization
```

### 5. User Management API Documentation
```powershell
# After completing API docs
git add content/docs/development/
git commit -m "docs(api): complete user management API documentation

- Document authentication endpoints
- Create session management API guide
- Add role and permissions documentation
- Include code examples and responses

Refs: PHASE 0.2 - API Documentation"

git push origin feature/docs-organization
```

### 6. User Guides Documentation
```powershell
# After creating user guides
git add content/docs/admin/ content/docs/user/
git commit -m "docs(users): create comprehensive user guides

- Admin user management guide
- User profile management guide
- Session management user guide
- Role-based access control guide
- Troubleshooting documentation

Refs: PHASE 0.2 - User Guides"

git push origin feature/docs-organization
```

### 7. Security Documentation
```powershell
# After security documentation
git add content/docs/development/
git commit -m "docs(security): add comprehensive security documentation

- Security best practices guide
- Authentication security guidelines
- Session security documentation
- Permission system security guide

Refs: PHASE 0.2 - Security Documentation"

git push origin feature/docs-organization
```

### 8. Create Sub-branches for Parallel Work
```powershell
# Content structure sub-branch
git checkout feature/docs-organization
git checkout -b feature/content-structure
git push -u origin feature/content-structure

# API documentation sub-branch
git checkout feature/docs-organization
git checkout -b feature/api-docs
git push -u origin feature/api-docs
```

### 9. Merge Sub-branches
```powershell
# Merge content structure
git checkout feature/docs-organization
git merge feature/content-structure
git push origin feature/docs-organization

# Merge API docs
git merge feature/api-docs
git push origin feature/docs-organization

# Delete merged branches
git branch -d feature/content-structure
git branch -d feature/api-docs
git push origin --delete feature/content-structure
git push origin --delete feature/api-docs
```

### 10. Complete PHASE 0
```powershell
# Final PHASE 0 commit
git add .
git commit -m "feat(docs): complete PHASE 0 documentation organization

✅ Documentation Structure Organization
- Reorganized /content/docs/ folder structure
- Standardized naming conventions
- Created consistent navigation structure
- Implemented cross-references between documents

✅ Documentation Management System
- Added documentation index and navigation
- Implemented search functionality
- Added versioning system
- Created documentation templates

✅ Content Management Enhancement
- Standardized markdown formatting
- Created documentation style guide
- Implemented link validation
- Added health checks

✅ User Management Documentation
- Complete API documentation
- Admin and user guides
- Security documentation
- Troubleshooting guides

BREAKING CHANGE: Documentation structure reorganized
Refs: PHASE 0 Complete - Ready for v0.1.0 release"

git push origin feature/docs-organization
```

### 11. Merge to Develop and Main
```powershell
# Merge to develop
git checkout develop
git pull origin develop
git merge feature/docs-organization
git push origin develop

# Merge to main for v0.1.0 release
git checkout main
git pull origin main
git merge develop
git push origin main

# Tag v0.1.0 release
git tag -a v0.1.0 -m "Release v0.1.0: Complete User Management System

✅ Features:
- JWT Authentication & Session Management (19/19 tests passed)
- User Management System with RBAC
- Profile Management with avatar upload
- Dashboard Framework
- Complete Documentation Organization

🎯 Next: PHASE 2 - Core Training Management System"

git push origin v0.1.0
```

## 🔧 Quick Development Commands

### Check Current Status
```powershell
# Check current branch and status
git status
git branch -a

# Check recent commits
git log --oneline -10

# Check remote branches
git remote -v
```

### Quick Fixes
```powershell
# Fix bug in current branch
git add .
git commit -m "fix(auth): resolve session timeout issue

- Fix token refresh mechanism
- Update session expiry validation
- Add error handling for expired tokens

Fixes: #123"

# Hotfix for production
git checkout main
git checkout -b hotfix/critical-auth-fix
# Make changes
git add .
git commit -m "hotfix(auth): fix critical authentication vulnerability

- Patch JWT token validation
- Update security middleware
- Add additional token verification

SECURITY: Critical security patch"
git push -u origin hotfix/critical-auth-fix
```

### Testing Commits
```powershell
# Add new tests
git add tests/
git commit -m "test(sessions): add comprehensive session management tests

- Add session creation tests
- Add session validation tests  
- Add multi-device session tests
- Add session cleanup tests

Coverage: 100% for session management module"
```

### Configuration Changes
```powershell
# Update configuration
git add *.config.*
git commit -m "config(build): update build configuration for production

- Optimize bundle size
- Update TypeScript configuration
- Configure production environment variables
- Update ESLint rules"
```

## 📋 Next Phase Preparation

### PHASE 2 Branch Setup
```powershell
# After v0.1.0 release, start PHASE 2
git checkout develop
git pull origin develop
git checkout -b feature/training-management-core
git push -u origin feature/training-management-core

# Create sub-branches for PHASE 2
git checkout -b feature/training-database-schema
git push -u origin feature/training-database-schema

git checkout feature/training-management-core
git checkout -b feature/training-api
git push -u origin feature/training-api
```

## 🎯 Commit Best Practices

1. **One logical change per commit**
2. **Clear, descriptive commit messages**
3. **Reference issue numbers when applicable**
4. **Use conventional commit format**
5. **Test before committing**
6. **Keep commits focused and atomic**

---

*Last Updated: May 27, 2025*
*Current Phase: PHASE 0 - Documentation Organization*
