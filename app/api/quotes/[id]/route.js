import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Quote from '@/models/Quote';
import { asyncWrapper } from '@/lib/asyncWrapper';
import { AppError } from '@/lib/appError';

// GET /api/quotes/[id] — fetch a single quote and increment views
export const GET = asyncWrapper(async (req, { params }) => {
  await connectDB();
  const authUser = await getAuthUser();

  const { id } = await params;

  const quote = await Quote.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!quote) throw new AppError('Quote not found', 404);

  return NextResponse.json({
    quote: {
      ...quote,
      id: quote._id.toString(),
      _id: undefined,
      createdAt: quote.createdAt?.toISOString().split('T')[0] ?? '',
      likedByMe: authUser ? (quote.likedBy || []).map(String).includes(String(authUser.userId)) : false,
      likedBy: undefined,
    },
  });
});

// DELETE /api/quotes/[id]
export const DELETE = asyncWrapper(async (req, { params }) => {
  const authUser = await getAuthUser();
  if (!authUser) throw new AppError('Unauthorized', 401);

  await connectDB();
  const { id } = await params;

  const quote = await Quote.findById(id);
  if (!quote) throw new AppError('Quote not found', 404);
  if (String(quote.createdBy) !== String(authUser.userId)) throw new AppError('You can only delete your own quotes', 403);

  await quote.deleteOne();
  return NextResponse.json({ message: 'Quote deleted' });
});
