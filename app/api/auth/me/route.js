import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { asyncWrapper } from '@/lib/asyncWrapper';

export const GET = asyncWrapper(async () => {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({ user });
});
