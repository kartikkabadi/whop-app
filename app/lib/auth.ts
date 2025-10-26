import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getWhopUser } from './whop-oauth';

/**
 * Check if user is authenticated via Whop OAuth
 * Returns user data if authenticated, null otherwise
 */
export async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('whop_access_token')?.value;

    if (!accessToken) {
      return null;
    }

    const user = await getWhopUser(accessToken);
    return user;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

/**
 * Middleware for API routes to require authentication
 * Returns 401 if user is not authenticated
 */
export async function requireAuth(request: NextRequest) {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required', authenticated: false },
      { status: 401 }
    );
  }
  
  return { user, authenticated: true };
}

/**
 * Check if user has access to a specific resource
 * Can be extended with more complex permission logic
 */
export async function checkAccess(resourceId?: string) {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return { hasAccess: false, user: null };
  }
  
  // Add custom access logic here if needed
  // For now, authenticated users have access to all resources
  return { hasAccess: true, user };
}
