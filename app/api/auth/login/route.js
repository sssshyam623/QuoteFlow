import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';
import { AUTH_COOKIE } from '@/lib/auth';
import { asyncWrapper } from '@/lib/asyncWrapper';
import { AppError } from '@/lib/appError';

export const POST = asyncWrapper(async (req) => {
  const { email, password } = await req.json();

  if (!email || !password) throw new AppError('Email and password are required', 400);

  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new AppError('Invalid email or password', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const token = await signToken({ userId: user._id.toString(), name: user.name, email: user.email });

  const res = NextResponse.json({
    user: { id: user._id.toString(), name: user.name, email: user.email },
  });

  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
});
