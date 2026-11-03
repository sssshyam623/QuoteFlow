'use client';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';

const tagColors = {
  Motivation: 'bg-purple-100 text-purple-700',
  Life: 'bg-green-100 text-green-700',
  Inspiration: 'bg-blue-100 text-blue-700',
  Success: 'bg-yellow-100 text-yellow-700',
};

export default function QuoteCard({ quote, compact = false }) {
  // Support both id and _id for safety
  const quoteId = quote?.id || quote?._id?.toString();

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-2 mb-3">
        <span className="text-3xl text-primary font-bold leading-none">"</span>
        <p className="text-gray-800 font-medium text-sm leading-relaxed">{quote.text}</p>
      </div>
      <p className="text-gray-500 text-sm mb-3">— {quote.author}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {quote.tag && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${tagColors[quote.tag] || 'bg-gray-100 text-gray-600'}`}>
              {quote.tag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-xs">
          <LikeButton
            quoteId={quoteId}
            initialLikes={quote.likes}
            initialLikedByMe={quote.likedByMe}
            size={13}
          />
          {!compact && (
            <span className="flex items-center gap-1">
              <Eye size={13} /> <span>{quote.views ?? 0}</span>
            </span>
          )}
          <ShareButton quote={{ ...quote, id: quoteId }} size={13} />
        </div>
      </div>
      {!compact && (
        <Link href={`/quotes/${quoteId}`} className="mt-3 block text-xs text-primary hover:underline">
          View details →
        </Link>
      )}
    </div>
  );
}
