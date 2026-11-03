import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';
import { AUTH_COOKIE } from '@/lib/auth';
import { asyncWrapper } from '@/lib/asyncWrapper';
import { AppError } from '@/lib/appError';

export const POST = asyncWrapper(async (req) => {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required', 400);
  }
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError('An account with this email already exists', 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });

  const token = await signToken({ userId: user._id.toString(), name: user.name, email: user.email });

  const res = NextResponse.json({
    user: { id: user._id.toString(), name: user.name, email: user.email },
  });

  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days, matches JWT expiry
  });

  return res;
});
