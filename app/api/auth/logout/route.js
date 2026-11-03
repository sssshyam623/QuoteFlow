import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import { asyncWrapper } from '@/lib/asyncWrapper';

export const POST = asyncWrapper(async () => {
  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.set(AUTH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
});
