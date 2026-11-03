import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export const AUTH_COOKIE = 'token';

// Reads the JWT from the httpOnly cookie and returns { userId, name, email }
// or null if there's no valid session. Use this in API route handlers
// instead of Clerk's auth().
export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    userId: payload.userId,
    name: payload.name,
    email: payload.email,
  };
}
