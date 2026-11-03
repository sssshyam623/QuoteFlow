import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Quote from '@/models/Quote';
import { asyncWrapper } from '@/lib/asyncWrapper';
import { AppError } from '@/lib/appError';

// POST /api/quotes/[id]/like  — toggle like
export const POST = asyncWrapper(async (req, { params }) => {
  const authUser = await getAuthUser();
  if (!authUser) throw new AppError('You must be signed in to like a quote.', 401);

  await connectDB();
  const { id } = await params;

  const quote = await Quote.findById(id);
  if (!quote) throw new AppError('Quote not found', 404);

  const userId = String(authUser.userId);
  const alreadyLiked = quote.likedBy.map(String).includes(userId);

  if (alreadyLiked) {
    quote.likedBy = quote.likedBy.filter((lid) => String(lid) !== userId);
    quote.likes = Math.max(0, quote.likes - 1);
  } else {
    quote.likedBy.push(userId);
    quote.likes += 1;
  }

  await quote.save();

  return NextResponse.json({
    likes: quote.likes,
    likedByMe: !alreadyLiked,
  });
});
