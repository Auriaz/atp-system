/**
 * JWT Authentication Middleware
 * Validates JWT access tokens from Authorization header or access_token cookie
 * Works alongside the existing session-based authentication system
 */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  // Debug logging
  console.log('JWT Middleware: Processing path:', path);

  // Skip JWT validation for public routes and auth endpoints
  if (
    path.startsWith('/api/auth/') ||
    path === '/api/health' ||
    path.startsWith('/_nuxt/') ||
    path.startsWith('/favicon.ico') ||
    path.startsWith('/__nuxt_devtools__/')
    || path.startsWith('/api/_hub/')
  ) {
    console.log('JWT Middleware: Skipping public path:', path);
    return;
  }

  // Skip JWT validation if we're not dealing with API routes
  if (!path.startsWith('/api/')) {
    console.log('JWT Middleware: Skipping non-API path:', path);
    return;
  }

  console.log('JWT Middleware: Processing API path:', path);

  // Try to get JWT access token from multiple sources
  let accessToken: string | undefined;

  // 1. Check Authorization header (Bearer token)
  const authHeader = getHeader(event, 'authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    accessToken = authHeader.substring(7);
    console.log('JWT Middleware: Found Bearer token');
  }

  // 2. Check access_token cookie as fallback
  if (!accessToken) {
    accessToken = getCookie(event, 'access_token');
    if (accessToken) {
      console.log('JWT Middleware: Found access token in cookie');
    }
  }

  // 3. Check query parameter as last resort (for development/testing)
  if (!accessToken && process.env.NODE_ENV === 'development') {
    const query = getQuery(event);
    accessToken = query.access_token as string;
    if (accessToken) {
      console.log('JWT Middleware: Found access token in query');
    }
  }

  // If no access token found, check if session-based auth is available
  if (!accessToken) {
    console.log('JWT Middleware: No access token found, checking session');
    const session = await getUserSession(event);
    if (session?.user?.id) {
      console.log('JWT Middleware: Session authentication found, allowing access');
      // User is authenticated via session - allow access
      return;
    }

    console.log('JWT Middleware: No authentication found');
    // No authentication found - deny access
    throw createError({
      statusCode: 401,
      message: 'Authentication required. Please provide a valid access token or establish a session.'
    });
  }

  console.log('JWT Middleware: Verifying access token');
  // Verify the JWT access token
  const payload = await verifyAccessToken(accessToken);

  if (!payload) {
    console.log('JWT Middleware: Invalid access token');
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired access token'
    });
  }

  console.log('JWT Middleware: Valid JWT token for user:', payload.userId);
  // Add JWT payload to the event context for use in API handlers
  event.context.jwtUser = {
    userId: payload.userId,
    email: payload.email,
    roles: payload.roles,
    iat: payload.iat,
    exp: payload.exp
  };

  // Optionally set user session based on JWT payload for compatibility
  // This allows existing code that depends on getUserSession() to work
  if (!await getUserSession(event)) {
    try {
      // Get full user data from database
      const user = await getUserById(payload.userId);
      if (user) {
        await setUserSession(event, {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            status: user.status || 'active',
            createdAtAgo: user.createdAtAgo
          },
          roles: payload.roles as RoleSlugs,
          expiresAt: (payload.exp || 0) * 1000, // Convert to milliseconds
          loggedInAt: (payload.iat || 0) * 1000, // Convert to milliseconds
          rememberMe: false
        });
      }
    } catch (error) {
      console.error('Failed to set session from JWT:', error);
      // Continue anyway as JWT is valid
    }
  }
});
