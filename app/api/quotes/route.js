import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { asyncWrapper } from '@/lib/asyncWrapper';
import { AppError } from '@/lib/appError';
import { quoteSchema } from '@/lib/zodSchemas';
import { connectDB } from '@/lib/mongodb';
import Quote from '@/models/Quote';

// No more static seed — DB starts empty until users add real quotes

export const GET = asyncWrapper(async (req) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag');
  const author = searchParams.get('author');
  const sortBy = searchParams.get('sortBy') || 'newest';

  const filter = {};
  if (tag && tag !== 'All Tags') filter.tag = tag;
  if (author && author !== 'All Authors') filter.author = author;

  let sortOption = { createdAt: -1 };
  if (sortBy === 'Most Liked') sortOption = { likes: -1 };
  else if (sortBy === 'Oldest') sortOption = { createdAt: 1 };

  const authUser = await getAuthUser();
  const quotes = await Quote.find(filter).sort(sortOption).lean();

  const formatted = quotes.map((q) => ({
    ...q,
    id: q._id.toString(),
    _id: undefined,
    createdAt: q.createdAt?.toISOString().split('T')[0] ?? '',
    likedByMe: authUser ? (q.likedBy || []).map(String).includes(String(authUser.userId)) : false,
    likedBy: undefined,
  }));

  return NextResponse.json({ quotes: formatted, total: formatted.length });
});

export const POST = asyncWrapper(async (req) => {
  const authUser = await getAuthUser();
  if (!authUser) throw new AppError('You must be signed in to add a quote.', 401);

  await connectDB();

  const body = await req.json();
  const result = quoteSchema.safeParse(body);
  if (!result.success) throw new AppError(result.error.errors[0].message, 400);

  const newQuote = await Quote.create({
    ...result.data,
    createdBy: authUser.userId,
    createdByName: authUser.name || 'Anonymous',
  });

  return NextResponse.json({
    quote: {
      ...newQuote.toObject(),
      id: newQuote._id.toString(),
      _id: undefined,
      likedByMe: false,
      likedBy: undefined,
      createdAt: newQuote.createdAt.toISOString().split('T')[0],
    },
  }, { status: 201 });
});
